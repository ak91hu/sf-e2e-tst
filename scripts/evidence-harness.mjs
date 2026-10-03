import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const output = resolve('.validation', 'allure-failure-harness', String(Date.now()));
const child = spawnSync(process.execPath, ['scripts/e2e.mjs', 'run', '--config', 'e2e.evidence.config.ts', '--output', output], { stdio: 'inherit' });
assert.equal(child.status, 1, 'The canary must fail as a test assertion, not pass or crash.');
const report = JSON.parse(readFileSync(resolve(output, 'report.json'), 'utf8'));
assert.equal(report.run.results.length, 3);
for (const result of report.run.results) assert.equal(result.status, 'failed');
const manifest = JSON.parse(readFileSync(resolve(output, 'allure-results/current.json'), 'utf8'));
assert.equal(manifest.runId, report.run.id);
assert.equal(manifest.resultFiles, 3);
const directory = resolve(output, manifest.resultsDirectory);
const files = readdirSync(directory);
for (const filename of files.filter(name => name.endsWith('-result.json'))) {
const result = JSON.parse(readFileSync(resolve(directory, filename), 'utf8'));
assert.equal(result.status, 'failed');
assert.ok(result.steps.some(step => step.status === 'failed' && step.statusDetails.message.includes('ASSERTION_FAILED')));
const url = new URL(result.links[0].url);
if (result.name === 'Allure failure evidence canary') assert.equal(url.pathname + url.search, '/lightning/o/Opportunity/list?evidence=canary');
else if (result.name === 'Allure nested authentication URL redaction canary') {
  assert.equal(url.pathname, '/msg/maintenanceandavailable.jsp');
  assert.doesNotMatch(url.href, /synthetic-ui-(?:sid|content)-canary/);
  const nested = new URL(url.searchParams.get('retURL'));
  assert.match(nested.searchParams.get('sid'), /redacted|secret:/);
  assert.match(nested.searchParams.get('lm'), /redacted|secret:/);
}
else assert.equal(url.pathname + url.search, '/lightning/r/Contract/800000000000001AAA/view?evidence=role-restoration');
for (const name of ['Detailed attempt log', 'Failure URL', 'Screenshot at failure']) assert.ok(result.attachments.some(attachment => attachment.name === name), `Missing ${name}`);
const screenshot = result.attachments.find(attachment => attachment.name === 'Screenshot at failure');
assert.equal(readFileSync(resolve(directory, screenshot.source)).subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
const log = JSON.parse(readFileSync(resolve(directory, result.attachments.find(attachment => attachment.name === 'Detailed attempt log').source), 'utf8'));
assert.ok(log.steps.length > 3 && log.error.code === 'ASSERTION_FAILED');
if (result.name === 'Allure Service failure capture before Sales cleanup restoration') {
  const failedIndex = log.steps.findIndex(step => step.status === 'failed');
  const restorationIndex = log.steps.findIndex(step => JSON.stringify(step).includes('restored-sales'));
  assert.ok(failedIndex >= 0 && restorationIndex > failedIndex, 'Sales restoration must follow the failed Service assertion.');
  assert.equal(log.steps[restorationIndex].status, 'passed');
  const selected = report.run.results.find(item => item.titlePath.at(-1) === result.name);
  assert.equal(selected.attempts[0].cleanup, 'complete');
}
}
for (const name of files.filter(name => /\.(json|txt|properties)$/.test(name))) assert.doesNotMatch(readFileSync(resolve(directory, name), 'utf8'), /synthetic-ui-(otp|checksum|sid|content)-canary/);
console.log('OK | Failed assertion, detailed log, exact failure URL and automatic PNG verified in Allure.');
console.log(`Evidence harness: ${output}`);
