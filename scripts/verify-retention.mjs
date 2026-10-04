import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const evidenceOnly = args.includes('--evidence-only');
const output = resolve(args.find(arg => arg !== '--evidence-only') || '.e2e');
const report = JSON.parse(readFileSync(resolve(output, 'report.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(output, 'allure-results/current.json'), 'utf8'));
assert.equal(manifest.runId, report.run.id);
assert.equal(manifest.selectedTests, 100, 'Full suite must select exactly 100 UI results.');
assert.equal(manifest.resultFiles, 100, 'Full suite has zero retries and one result per case/setup.');
const directory = resolve(output, manifest.resultsDirectory);
const results = readdirSync(directory).filter(name => name.endsWith('-result.json')).map(name => JSON.parse(readFileSync(resolve(directory, name), 'utf8')));
let records = 0;
for (const result of results) {
  if (result.status !== 'passed') continue;
  const screenshots = result.attachments.filter(item => item.name === 'Screenshot of successful UI run');
  assert.ok(screenshots.length, `Missing successful PNG: ${result.name}`);
  for (const screenshot of screenshots) assert.equal(readFileSync(resolve(directory, screenshot.source)).subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  if (/^SF-AUTH(?: |\-SERVICE )/.test(result.name)) continue;
  const attachment = result.attachments.find(item => item.name === 'Permanently retained sandbox records');
  assert.ok(attachment, `Missing retained record manifest: ${result.name}`);
  const retained = JSON.parse(readFileSync(resolve(directory, attachment.source), 'utf8'));
  assert.equal(retained.retention, 'permanent');
  for (const record of retained.records) {
    assert.ok(result.links.some(link => link.type === 'retained-record' && link.url === record.url), `Missing ${record.object} link in ${result.name}`);
    records++;
  }
}
const passed = results.filter(result => result.status === 'passed').length;
console.log(`OK | ${passed}/100 passed results verified for PNGs and ${records} permanent record links; run ${manifest.runId}.`);
if (!evidenceOnly) {
  assert.equal(passed, 100, 'Evidence checks do not turn failed or skipped tests into successful results.');
  assert.equal(manifest.sourceExitCode, 0);
} else console.log(`Evidence-only verification; original source exit ${manifest.sourceExitCode} and failed results remain unchanged.`);
