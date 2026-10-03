import { spawn } from 'node:child_process';
import { resolve, dirname, basename } from 'node:path';
import '../support/environment.ts';
const files = process.argv.slice(2).map(file => resolve(file));
if (!files.length) throw new Error('Supply exact attempt journal paths. Recovery never bulk-deletes by prefix.');
for (const file of files) if (dirname(file) !== resolve('.e2e-data') || !/^E2E-TA-attempt-[a-z0-9]+-[a-f0-9]{8}\.json$/.test(basename(file))) throw new Error('Only workspace attempt journals are accepted.');
process.env.E2E_RECOVERY_JOURNALS = JSON.stringify(files);
const child = spawn(process.execPath, ['scripts/e2e.mjs', 'run', '--config', 'e2e.recovery.config.ts'], { stdio: 'inherit', env: process.env });
child.on('exit', code => { process.exitCode = code ?? 2; });
