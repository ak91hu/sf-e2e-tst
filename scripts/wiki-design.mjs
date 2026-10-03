import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { testDesigns } from '../docs/test-design.ts';

const directory = 'docs/wiki';
const root = 'https://github.com/ak91hu/sf-e2e-tst';
const cell = value => value.replaceAll('|', '\\|').replaceAll('\n', '<br>');
const group = id => id.startsWith('SF-OPP') ? 'Opportunity' : id.startsWith('SF-CON') ? 'Contract' : id.startsWith('SF-QUO') ? 'Quote' : id.startsWith('SF-ROLE') ? 'Roles and Service' : id.startsWith('SF-E2E') ? 'Sales to Service' : id.startsWith('SF-AI') ? 'Optional AI' : 'Authentication';
const pages = new Map();
for (const design of testDesigns) {
  assert.ok(design.steps.every(step => step.length === 3 && step.every(value => value.trim())));
  pages.set(`${design.id}.md`, `# ${design.id} — ${design.title}\n\n[All test designs](${root}/wiki) · [Executable source](${root}/blob/main/${design.file}) · [Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)\n\n**Role:** ${design.persona}\n\n**Preconditions:** ${design.preconditions}\n\n**Test data:** ${design.data}\n\nThe following steps define expected behavior. Execution status is recorded in Allure and [verification evidence](${root}/blob/main/docs/VERIFICATION.md); this page does not claim an execution result. Generated dates, names and IDs are substituted at runtime.\n\n| Action | Data | Expected output |\n| --- | --- | --- |\n${design.steps.map(([action, data, expected], index) => `| ${index + 1}. ${cell(action)} | ${cell(data)} | ${cell(expected)} |`).join('\n')}\n\nGenerated from [docs/test-design.ts](${root}/blob/main/docs/test-design.ts). Update the source, then run \`npm run design:generate\` and \`npm run wiki:generate\`.\n`);
}
pages.set('Home.md', `# Salesforce UI regression test designs\n\n**41 designs, 321 explicit steps:** 36 standard regression cases, 3 optional AI cases and 2 role-specific session setups. Every case has an **Action / Data / Expected output** table, including preparation and cleanup. All business record creation, assertions and cleanup use Salesforce Lightning UI. Opportunity creation runs as E2E Sales Manager; E2E Service Manager covers permissions, Case operations and the read-only Contract handoff.\n\n[Repository](${root}) · [README](${root}/blob/main/README.md) · [GitHub Actions](${root}/actions/workflows/salesforce-regression.yml) · [Live Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)\n\nThese are test designs, not run results. The normal full run selects 38 results (36 cases + 2 setups); optional AI cases require separate model quota. Dates use UTC for entered relative dates and the configured Salesforce user timezone for automatic Closed Won dates. Secrets are excluded.\n\n| ID | Area | Objective | Role |\n| --- | --- | --- | --- |\n${testDesigns.map(design => `| [${design.id}](${root}/wiki/${design.id}) | ${group(design.id)} | ${cell(design.title)} | ${cell(design.persona)} |`).join('\n')}\n\nEditable source: [docs/test-design.ts](${root}/blob/main/docs/test-design.ts). Repository copy: [docs/TEST_DESIGN.md](${root}/blob/main/docs/TEST_DESIGN.md). Generated wiki pages: [docs/wiki](${root}/tree/main/docs/wiki).\n`);
pages.set('_Sidebar.md', `[Home](${root}/wiki)\n\n` + [...new Set(testDesigns.map(design => group(design.id)))].map(area => `**${area}**\n\n${testDesigns.filter(design => group(design.id) === area).map(design => `- [${design.id}](${root}/wiki/${design.id})`).join('\n')}\n`).join('\n'));
mkdirSync(directory, { recursive: true });
for (const [file, content] of pages) {
  const path = `${directory}/${file}`;
  if (process.argv.includes('--check')) assert.equal(readFileSync(path, 'utf8'), content, `Regenerate ${path}.`);
  else writeFileSync(path, content);
}
console.log(`OK | ${pages.size} wiki pages; ${testDesigns.length} cases; Action / Data / Expected output for every step.`);
