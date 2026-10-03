import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Read-only audit against primary registries. Do not silently change the lockfile.
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const results = await Promise.all(Object.entries(pkg.devDependencies).map(async ([alias, pin]) => {
  const match = /^npm:(.+)@([^@]+)$/.exec(pin);
  const name = match?.[1] ?? alias;
  const used = match?.[2] ?? pin;
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`);
  assert.ok(response.ok, `Registry unavailable: ${name}`);
  const latest = (await response.json()).version;
  assert.equal(lock.packages[`node_modules/${alias}`].version, used, `Lock mismatch: ${alias}`);
  return { component: alias === name ? name : `${alias} (${name})`, used, latest };
}));
for (const [name, used] of [['npm', pkg.packageManager.split('@')[1]], ['@salesforce/cli', '2.152.14']]) {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`);
  assert.ok(response.ok, `Registry unavailable: ${name}`);
  results.push({ component: name, used, latest: (await response.json()).version });
}
const nodeResponse = await fetch('https://nodejs.org/dist/index.json');
assert.ok(nodeResponse.ok, 'Node release index unavailable.');
const nodeLatest = (await nodeResponse.json()).find(item => /^v\d+\.\d+\.\d+$/.test(item.version)).version.slice(1);
const nodePin = readFileSync('.nvmrc', 'utf8').trim();
results.push({ component: 'Node.js', used: nodePin, latest: nodeLatest });
const workflow = readFileSync('.github/workflows/salesforce-regression.yml', 'utf8');
assert.ok(workflow.includes(`node-version: '${nodePin}'`), 'Workflow Node pin mismatch.');
assert.ok(workflow.includes(`npm@${pkg.packageManager.split('@')[1]}`), 'Workflow npm pin mismatch.');
const actions = new Map([...workflow.matchAll(/uses: (actions\/[^\s@]+)@(v[\d.]+)/g)].map(([, repo, version]) => [repo.split('/').slice(0, 2).join('/'), version]));
for (const [repo, used] of actions) {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: { 'User-Agent': 'salesforce-ui-version-audit', Accept: 'application/vnd.github+json' } });
  assert.ok(response.ok, `GitHub release unavailable: ${repo}`);
  results.push({ component: repo, used, latest: (await response.json()).tag_name });
}
let outdated = false;
console.log(`Stable component version audit: ${new Date().toISOString()}`);
for (const { component, used, latest } of results) {
  const ok = used === latest;
  console.log(`${ok ? 'CURRENT' : 'UPDATE AVAILABLE'} | ${component} | pinned ${used} | latest ${latest}`);
  outdated ||= !ok;
}
console.log('Transitive dependencies follow upstream compatibility ranges and package-lock.json.');
process.exitCode = outdated ? 1 : 0;
