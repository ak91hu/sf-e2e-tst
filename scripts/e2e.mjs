import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import '../support/environment.ts';

// Set before Playwright is imported; keep downloaded browsers in the workspace.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve('.browsers');
process.env.E2E_TELEMETRY_DISABLED ||= '1';
const require = createRequire(import.meta.url);
const cli = resolve(require.resolve('e2e'), '../cli/bin.js');
const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], { stdio: 'inherit', env: process.env });
child.on('error', error => { console.error(error.message); process.exitCode = 2; });
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 130 : 2); });
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
