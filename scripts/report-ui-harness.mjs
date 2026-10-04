import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const html = readFileSync(resolve(process.argv[2] || 'allure-report/index.html'));
const server = createServer((request, response) => {
  if (request.url === '/' || request.url === '/index.html') { response.writeHead(200, { 'Content-Type': 'text/html' }); response.end(html); }
  else { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const child = spawn(process.execPath, ['scripts/e2e.mjs', 'run', '--config', 'e2e.report-ui.config.ts', '--output', `.validation/report-ui/${Date.now()}`], { stdio: 'inherit', env: { ...process.env, E2E_REPORT_URL: `http://127.0.0.1:${address.port}`, E2E_REPORT_CASE: process.argv[3] || '', E2E_REPORT_DESIGN: process.argv[4] === '--design' ? '1' : '', E2E_REPORT_SUCCESS: process.argv[4] === '--success' ? '1' : '' } });
child.on('error', () => { process.exitCode = 2; server.close(); });
child.on('exit', code => { process.exitCode = code ?? 2; server.close(); });
