import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const files = [];
function collect(directory) {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, file.name);
    if (file.isDirectory()) collect(path);
    else if (file.name.endsWith('.e2e.ts') && !file.name.includes('.setup.')) files.push(path);
  }
}
collect('tests');
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  assert.doesNotMatch(source, /\bgetBy(?:Role|Label|Text|Placeholder|TestId)\s*\(|\bbrowser\.(?:evaluate|locator)\s*\(|\bfetch\s*\(|\b(?:querySelector|setTimeout)\s*\(/, `UI selector/API escaped the POM in ${file}`);
}
console.log(`OK | ${files.length} business/UI test source files use page objects; no raw selectors, DOM evaluation, business fetch or sleeps.`);
