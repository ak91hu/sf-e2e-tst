import { randomUUID } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { FinishedRun, Report } from 'e2e';
import type { TestResult } from 'allure-js-commons';
import { environment } from '../support/environment.ts';
import { writeAllureResults } from '../reporting/allure.ts';

export type Result = Report['run']['results'][number];
export type Attempt = Result['attempts'][number];
export type Artifact = Attempt['artifacts'][number];
export const startedAt = '2026-10-04T10:00:00.000Z';
// Synthetic 1x1 PNG for serializer tests; live evidence comes from the browser harness.
export const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9b8AAAAASUVORK5CYII=', 'base64');

export function attempt(overrides: Partial<Attempt> = {}): Attempt {
  return { id: randomUUID(), index: 0, status: 'passed', startedAt, durationMs: 100, artifacts: [], secondaryErrors: [], cleanup: 'complete', steps: [], ...overrides };
}

export function result(overrides: Partial<Result> = {}): Result {
  return {
    id: randomUUID(), testId: 'report-contract', kind: 'test', declarationIndex: 0,
    titlePath: ['Synthetic reporting contract'], file: 'synthetic/reporting.ts', source: { file: 'synthetic/reporting.ts', line: 1, column: 1 },
    targetId: 'chromium', platform: 'web', agent: 'deterministic', repeat: 0, tags: ['reporting'], selected: true, status: 'passed', attempts: [attempt()], ...overrides,
  };
}

export function fixture(results: readonly Result[] = [result()]) {
  const parent = resolve('.validation', 'reporting-tests');
  mkdirSync(parent, { recursive: true });
  const directory = mkdtempSync(resolve(parent, 'run-'));
  const artifactsRoot = resolve(directory, 'artifacts');
  mkdirSync(artifactsRoot);
  const report: Report = { schemaVersion: 'report-1', run: {
    id: randomUUID(), specVersion: '0.1', runner: { name: 'e2e', version: 'synthetic' }, startedAt, finishedAt: startedAt,
    project: { id: 'reporting-contracts', configDigest: 'synthetic' },
    environment: { ci: false, trustNoticeShown: false, os: process.platform, arch: process.arch, runtime: process.version },
    targets: [], serialGroups: [], results, errors: [], status: 'passed', exitCode: 0,
    summary: { discovered: results.length, selected: results.filter(item => item.selected).length, executed: results.length, passed: results.length, failed: 0, flaky: 0, skipped: 0 },
    limits: { maxAgentContextBytes: 1000, maxLedgerBytes: 1000, maxObservationBytes: 1000, maxEventsPerStep: 100, maxModelTokensPerCall: 1000 },
    usage: { discoveredResults: results.length, maxAgentContextBytes: 0, maxLedgerBytes: 0, maxObservationBytes: 0, artifactBytes: 0, downloads: 0, events: 0, modelTokens: 0, maxModelCallsInStep: 0, maxActionStepsInStep: 0 },
  } };
  const run: FinishedRun = { report, status: 'passed', exitCode: 0, projectRoot: resolve('.'), reportPath: resolve(directory, 'report.json'), artifactsRoot, aiTracePath: undefined };
  writeFileSync(run.reportPath!, JSON.stringify(report, null, 2));
  return {
    run, directory,
    artifact(path: string, bytes: string | Buffer = png, overrides: Partial<Artifact> = {}): Artifact {
      const actual = resolve(artifactsRoot, path);
      mkdirSync(dirname(actual), { recursive: true }); writeFileSync(actual, bytes);
      return { id: path, kind: 'screenshot', mediaType: 'image/png', path, redaction: 'complete', producer: { kind: 'attempt' }, ...overrides };
    },
    export() {
      const output = writeAllureResults(run);
      return { output, results: readdirSync(output).filter(name => name.endsWith('-result.json')).map(name => JSON.parse(readFileSync(resolve(output, name), 'utf8')) as TestResult) };
    },
  };
}

export const retained = (object = 'Opportunity', id = '006000000000001AAA') => ({ object, id, name: `E2E-TA-${object}`, url: `${environment.baseUrl}/lightning/r/${object}/${id}/view` });
