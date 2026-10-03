import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const output = `.validation/auth-harness/${Date.now()}`;
const result = spawnSync(process.execPath, ['scripts/e2e.mjs', 'run', '--config', 'e2e.validation.config.ts',
  '--output', output], { stdio: 'inherit' });
if (result.error || result.status !== 0) process.exit(result.status || 2);
function scan(directory) {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, file.name);
    if (file.isDirectory()) scan(path);
    else if (/\.(json|xml|md|txt)$/.test(file.name)) {
      const text = readFileSync(path, 'utf8');
      if (/synthetic-ui-otp-canary|synthetic-ui-checksum-canary/.test(text)) {
        throw new Error('Synthetic UI session secret leaked into the authentication report.');
      }
    }
  }
}
scan(resolve(output));
console.log('OK | Synthetic session secrets absent from all text reports and artifacts.');
