import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

try {
  const report = JSON.parse(readFileSync(resolve('.e2e/report.json'), 'utf8'));
  if (!report.run || !Array.isArray(report.run.results)) throw new Error('Ismeretlen e2e jelentésformátum.');
  const counts = {};
  for (const result of report.run.results) counts[result.status] = (counts[result.status] ?? 0) + 1;
  console.log(`Futás: ${report.run.status}; kilépési kód: ${report.run.exitCode}`);
  console.log(`Eredmények: ${JSON.stringify(counts)}`);
  const failures = report.run.results.filter(result => result.status !== 'passed' && result.status !== 'skipped');
  for (const result of failures) {
    console.log(`${result.status} | ${(result.titlePath ?? []).join(' / ')}`);
  }
  if (report.run.errors?.length) console.log(`Futásszintű hibák: ${report.run.errors.length}`);
  console.log('Részletek: .e2e/report.json; .e2e/junit.xml; .e2e/summary.md');
  process.exitCode = report.run.exitCode ?? 2;
} catch (error) {
  console.error(error.code === 'ENOENT'
    ? 'Még nincs .e2e/report.json. Előbb futtasd: npm run test:e2e'
    : error.message);
  process.exitCode = 2;
}
