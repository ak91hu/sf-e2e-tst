import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import '../support/environment.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve('.browsers');
const require = createRequire(import.meta.url);
const cli = resolve(dirname(require.resolve('playwright/package.json')), 'cli.js');
const child = spawn(process.execPath, [cli, 'install', 'chromium', ...process.argv.slice(2)], {
  stdio: 'inherit', env: process.env,
});
child.on('error', error => { console.error(error.message); process.exitCode = 2; });
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 130 : 2); });
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
