import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const entry = require.resolve('@e2e-dev/web');
const pkg = JSON.parse(readFileSync(resolve(entry, '../../package.json'), 'utf8'));
if (pkg.version !== '0.11.2') throw new Error('Review the Salesforce semantic compatibility patch before changing the web engine version.');
const path = resolve(entry, '../in-page/read-semantics.js');
const source = readFileSync(path, 'utf8');
const before = 'return root instanceof Document || root instanceof DocumentFragment ? root.getElementById(id) : null;';
const after = `// Salesforce synthetic ShadowRoot rejects getElementById; keep IDREF lookup scoped.
        if (root instanceof Document) return root.getElementById(id);
        return root instanceof DocumentFragment ? root.querySelector(\`#\${CSS.escape(id)}\`) : null;`;
if (source.includes(after)) {
  console.log('OK | Salesforce ShadowRoot semantic compatibility patch already applied.');
} else {
  if (source.split(before).length !== 2) throw new Error('Unexpected web semantic reader; compatibility patch refused.');
  writeFileSync(path, source.replace(before, after));
  console.log('OK | Salesforce ShadowRoot semantic compatibility patch applied.');
}
