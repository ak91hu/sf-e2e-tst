import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import '../support/environment.ts';

const directory = resolve('allure-report');
assert.ok(existsSync(resolve(directory, 'index.html')), 'Generate the Allure report first.');
const manifest = JSON.parse(readFileSync(resolve(directory, 'run-manifest.json'), 'utf8'));
const current = JSON.parse(readFileSync('.e2e/report.json', 'utf8'));
assert.equal(manifest.runId, current.run.id, 'Do not deploy an old run.');
assert.ok(manifest.selectedTests > 0);
const allowed = new Set(['index.html', 'summary.json', 'test-results.json', 'run-manifest.json']);
for (const file of readdirSync(directory, { withFileTypes: true })) assert.ok(file.isFile() && allowed.has(file.name), `Unexpected deployment file: ${file.name}`);
const site = process.env.NETLIFY_SITE_ID;
assert.ok(site, 'Set NETLIFY_SITE_ID to the intended report site.');
if (process.env.CI) assert.ok(process.env.NETLIFY_AUTH_TOKEN, 'CI requires NETLIFY_AUTH_TOKEN.');
const child = spawnSync(process.execPath, ['node_modules/netlify-cli/bin/run.js', 'deploy', '--dir', directory, '--site', site, '--prod', '--no-build', '--json'], { encoding: 'utf8', maxBuffer: 1024 * 1024 });
if (child.error || child.status !== 0) {
  // Arbitrary CLI diagnostics can contain auth material; never echo them.
  console.error('Netlify deployment failed. Check the CLI login, site ID and account permissions.');
  process.exit(child.status || 2);
}
const deployment = JSON.parse(child.stdout);
const url = deployment.url || deployment.deploy_url;
assert.ok(typeof url === 'string' && /^https:\/\//.test(url));
console.log(`Allure report: ${url}`);
console.log(`Published run: ${manifest.runId}; Salesforce exit code: ${manifest.sourceExitCode}`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n[Allure report on Netlify](${url})\n\nRun: ${manifest.runId}; UI tests: ${manifest.selectedTests}; regression exit code: ${manifest.sourceExitCode}.\n`);
