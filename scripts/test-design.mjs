import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { testDesigns, designTotals } from '../docs/test-design.ts';
import { spawnSync } from 'node:child_process';

assert.ok(testDesigns.length > 0, 'At least one executable design is required.');
assert.equal(new Set(testDesigns.map(item => item.id)).size, testDesigns.length);
for (const item of testDesigns) {
  assert.ok(existsSync(item.file), `Missing source: ${item.file}`);
  assert.ok(item.steps.length >= 3 && item.steps.every(step => step.length === 3 && step.every(value => value.trim())));
}
const cell = value => value.replaceAll('|', '\\|').replaceAll('\n', '<br>');
const text = '# Salesforce UI step-level test designs\n\n' +
  `${designTotals.designs} designs: ${designTotals.regression} default regression UI cases, ${designTotals.optionalAI} AI UI cases and ${designTotals.setups} authentication setups. The complete test:all run selects exactly 100 results (98 cases + 2 setups). Designs specify intended behavior; actual execution evidence is recorded in VERIFICATION.md and Allure. Every case expands preparation and permanent-retention evidence steps.\n\n` +
  'Salesforce business data is created and verified exclusively through UI, and every created record remains in the sandbox permanently. Deletion confirmations are never accepted; destructive recovery is disabled. Successful results include redacted PNG screenshots and exact record links. Authentication endpoints and one-time administrative provisioning are configuration infrastructure. Each case owns isolated data; administrators never create Opportunities. Visible fields, controls, record URLs and list results prove each step. There are no fixed sleeps, API oracles or automatic test retries.\n\n' +
  'Dates are generated at runtime. `futureDate` uses UTC; the automatic Salesforce Closed Won date follows the user timezone (`SF_TIME_ZONE`, default Europe/Budapest). Environment variables configure Stage names and Won/Lost percentages for other sales processes; these designs describe the configured Developer Edition defaults. Optional AI cases require model access and quota.\n\n' +
  'Editable source: [test-design.ts](test-design.ts). Generate with `npm run design:generate`; verify with `npm run design:check`. Allure displays these same expected steps in each matched case description.\n\n' +
  '| ID | Objective | Role |\n| --- | --- | --- |\n' + testDesigns.map(item => `| [${item.id}](#${item.id.toLowerCase()}) | ${cell(item.title)} | ${cell(item.persona)} |`).join('\n') + '\n\n' +
  testDesigns.map(item => `## ${item.id}\n\n**Objective:** ${item.title}\n\n**Source:** [${item.file}](../${item.file})\n\n**Role:** ${item.persona}\n\n**Preconditions:** ${item.preconditions}\n\n**Test data:** ${item.data}\n\n| Action | Data | Expected output |\n| --- | --- | --- |\n${item.steps.map(([action, data, expected], index) => `| ${index + 1}. ${cell(action)} | ${cell(data)} | ${cell(expected)} |`).join('\n')}\n`).join('\n');
if (process.argv.includes('--check')) {
  assert.equal(readFileSync('docs/TEST_DESIGN.md', 'utf8'), text, 'Regenerate docs/TEST_DESIGN.md.');
  const found = new Set();
  for (const config of ['e2e.config.ts', 'e2e.agent.config.ts', 'e2e.all.config.ts']) {
    const child = spawnSync(process.execPath, ['scripts/e2e.mjs', 'list', '--config', config, '--reporter', 'json'], { encoding: 'utf8' });
    assert.equal(child.status, 0, 'Test collection must succeed for design coverage.');
    const pairs = JSON.parse(child.stdout).pairs;
    if (config === 'e2e.all.config.ts') {
      assert.equal(pairs.filter(pair => pair.disposition === 'run').length, 100, 'Complete UI suite must select exactly 100 results.');
      assert.equal(pairs.filter(pair => pair.kind === 'test').length, 98);
      assert.equal(pairs.filter(pair => pair.kind === 'setup').length, 2);
    }
    for (const pair of pairs) {
      const id = pair.title.split(' |')[0];
      const design = testDesigns.find(item => item.id === id);
      assert.ok(design && design.file === pair.file, `Missing or mismatched design: ${id}`);
      found.add(id);
    }
  }
  assert.equal(found.size, testDesigns.length, 'Every design must map to an executable case/setup.');
}
else writeFileSync('docs/TEST_DESIGN.md', text);
console.log(`OK | ${testDesigns.length} test designs, ${testDesigns.reduce((sum, item) => sum + item.steps.length, 0)} explicit steps.`);
