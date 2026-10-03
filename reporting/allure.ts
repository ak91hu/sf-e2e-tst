import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import type { FinishedRun, Report, Reporter } from 'e2e';
import { Stage, Status, type StepResult } from 'allure-js-commons';
import { ReporterRuntime, createDefaultWriter } from 'allure-js-commons/sdk/reporter';
import { testDesigns } from '../docs/test-design.ts';
import { redactAuthUrl } from '../support/auth-redaction.ts';
import { readableStepName } from './step-names.ts';

type Result = Report['run']['results'][number];
type Attempt = Result['attempts'][number];
type Failure = Attempt['error'];
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const instant = (value: string) => { const parsed = Date.parse(value); if (!Number.isFinite(parsed)) throw new Error('Invalid report timestamp.'); return parsed; };

export function allureStatus(status: string, error?: Failure): Status {
  if (status === 'passed' || status === 'flaky') return Status.PASSED;
  if (status === 'skipped' || status === 'cancelled') return Status.SKIPPED;
  if (status === 'failed' || status === 'timed-out') return error?.category === 'test' ? Status.FAILED : Status.BROKEN;
  return Status.BROKEN;
}

function errorDetails(error?: Failure) {
  return error ? { message: `${error.code}: ${error.message}`, trace: JSON.stringify(error, null, 2) } : {};
}

function steps(attempt: Attempt): StepResult[] {
  return attempt.steps.map(step => ({
    name: readableStepName(step.api, step.label),
    status: allureStatus(step.status, step.error), stage: Stage.FINISHED,
    start: instant(step.startedAt), stop: instant(step.startedAt) + step.durationMs,
    statusDetails: errorDetails(step.error), attachments: [],
    parameters: [{ name: 'Technical action', value: step.api }, { name: 'Locator or target', value: step.label }], steps: [],
  }));
}

function feature(result: Result) {
  const id = result.titlePath.at(-1) ?? '';
  return id.startsWith('SF-OPP') ? 'Opportunity' : id.startsWith('SF-CON') ? 'Contract'
    : id.startsWith('SF-QUO') ? 'Quote' : id.startsWith('SF-ROLE') ? 'Permissions and Service'
    : id.startsWith('SF-E2E') ? 'Sales to Service' : id.startsWith('SF-AUTH') ? 'Authentication' : 'Infrastructure';
}

// Only copy fully redacted evidence. Never attach sessions, auth files,
// traces, downloads, videos, or arbitrary paths supplied in an error message.
function attachEvidence(runtime: ReporterRuntime, uuid: string, attempt: Attempt, artifactsRoot: string) {
  for (const artifact of attempt.artifacts) {
    const screenshot = artifact.kind === 'screenshot' && artifact.id === attempt.failure?.screenshot && artifact.mediaType === 'image/png';
    const log = artifact.kind === 'log' && ['text/plain', 'application/json', 'text/markdown'].includes(artifact.mediaType);
    if ((!screenshot && !log) || artifact.redaction !== 'complete' || !artifact.path) continue;
    const path = resolve(artifactsRoot, artifact.path);
    const root = realpathSync(artifactsRoot); const actual = realpathSync(path);
    const child = relative(root, actual);
    if (isAbsolute(child) || child === '..' || child.startsWith(`..${sep}`)) throw new Error('Allure evidence is outside this run artifact directory.');
    if (statSync(actual).size > 4 * 1024 * 1024) continue;
    runtime.writeAttachment(uuid, undefined, screenshot ? 'Screenshot at failure' : 'Redacted UI evidence', readFileSync(actual), { contentType: artifact.mediaType, fileExtension: screenshot ? 'png' : artifact.mediaType === 'application/json' ? 'json' : 'txt' });
  }
}

export function failureUrl(value?: string) {
  return value ? redactAuthUrl(value) : undefined;
}

export function writeAllureResults(run: FinishedRun, signal?: AbortSignal) {
  if (!run.reportPath) throw new Error('Allure requires the completed e2e report.');
  const report = run.report; const runId = report.run.id;
  if (!/^[a-f0-9-]{16,64}$/.test(runId)) throw new Error('Invalid e2e run identifier.');
  const reportDirectory = dirname(run.reportPath);
  const resultsDirectory = resolve(reportDirectory, 'allure-results', runId);
  mkdirSync(resultsDirectory, { recursive: true });
  const runtime = new ReporterRuntime({ writer: createDefaultWriter({ resultsDir: resultsDirectory }) });
  let count = 0;
  // A --grep/--tag excluded test is not a skipped execution. Actual selected
  // skips are preserved; unrelated cases never inflate an Allure report.
  for (const result of report.run.results.filter(result => result.selected)) {
    const attempts: readonly (Attempt | undefined)[] = result.attempts.length ? result.attempts : [undefined];
    for (const attempt of attempts) {
      signal?.throwIfAborted();
      const fullName = `${result.file} > ${result.titlePath.join(' > ')} [${result.targetId}] [${result.agent}] [repeat ${result.repeat}]`;
      const start = instant(attempt?.startedAt ?? report.run.startedAt);
      const stop = start + (attempt?.durationMs ?? 0);
      const status = allureStatus(attempt?.status ?? result.status, attempt?.error);
      const url = failureUrl(attempt?.failure?.url);
      const design = testDesigns.find(design => result.titlePath.at(-1)?.startsWith(`${design.id} |`));
      const description = design
        ? `Role: ${design.persona}\n\nPreconditions: ${design.preconditions}\n\nData: ${design.data}\n\n${design.steps.map(([action, data, expected], index) => `${index + 1}. Action: ${action}\n   Data: ${data}\n   Expected: ${expected}`).join('\n\n')}`
        : 'No business test design: infrastructure validation.';
      const uuid = runtime.startTest({
        uuid: hash(`${runId}|${result.id}|${attempt?.index ?? 'not-executed'}`),
        name: result.titlePath.at(-1) ?? result.testId, fullName,
        historyId: hash(fullName), testCaseId: hash(result.testId),
        start, stop, status, stage: Stage.FINISHED,
        statusDetails: { ...errorDetails(attempt?.error), ...(result.skip ? { message: result.skip.reason } : {}) },
        description: `TesterArmy e2e UI test. Source: ${result.file}. Cleanup: ${attempt?.cleanup ?? 'not executed'}.\n\n${description}`,
        labels: [
          { name: 'framework', value: 'TesterArmy e2e' }, { name: 'language', value: 'TypeScript' },
          { name: 'parentSuite', value: 'Salesforce UI regression' }, { name: 'suite', value: feature(result) },
          { name: 'epic', value: 'Salesforce sales and service' }, { name: 'feature', value: feature(result) },
          { name: 'package', value: result.file }, ...result.tags.map(value => ({ name: 'tag', value })),
        ],
        parameters: [{ name: 'browser', value: result.targetId }, { name: 'agent', value: result.agent }, { name: 'repeat', value: String(result.repeat) }],
        links: url ? [{ name: 'URL at failure', type: 'failure', url }] : [],
        steps: attempt ? steps(attempt) : [],
      });
      if (attempt && status !== Status.PASSED) {
        runtime.writeAttachment(uuid, undefined, 'Detailed attempt log', Buffer.from(JSON.stringify({ test: fullName, startedAt: attempt.startedAt, durationMs: attempt.durationMs, status: attempt.status, failureUrl: url, error: attempt.error, secondaryErrors: attempt.secondaryErrors, cleanup: attempt.cleanup, steps: attempt.steps }, null, 2)), { contentType: 'application/json', fileExtension: 'json' });
        if (url) runtime.writeAttachment(uuid, undefined, 'Failure URL', Buffer.from(url), { contentType: 'text/uri-list', fileExtension: 'txt' });
        attachEvidence(runtime, uuid, attempt, run.artifactsRoot);
      }
      runtime.stopTest(uuid, { stop }); runtime.writeTest(uuid); count++;
    }
  }
  for (const [index, failure] of report.run.errors.entries()) {
    signal?.throwIfAborted();
    const error = failure;
    const start = instant(report.run.startedAt);
    const uuid = runtime.startTest({
      uuid: hash(`${runId}|run-error|${index}`), name: `Run error: ${error.code}`,
      fullName: `e2e run error / ${error.code} / ${index}`, historyId: hash(`run-error|${error.code}|${index}`),
      start, stop: start, status: Status.BROKEN, stage: Stage.FINISHED,
      statusDetails: errorDetails(error), labels: [{ name: 'suite', value: 'Run infrastructure' }],
    });
    runtime.stopTest(uuid, { stop: start }); runtime.writeTest(uuid); count++;
  }
  const selected = report.run.results.filter(result => result.selected).length;
  writeFileSync(resolve(resultsDirectory, 'environment.properties'), `Framework=TesterArmy e2e\nRun=${runId}\nMode=UI\nWorkers=1\n`);
  const manifest = { runId, selectedTests: selected, resultFiles: count, resultsDirectory: relative(reportDirectory, resultsDirectory).split(sep).join('/'), sourceStatus: run.status, sourceExitCode: run.exitCode };
  writeFileSync(resolve(reportDirectory, 'allure-results', 'current.json'), JSON.stringify(manifest, null, 2));
  return resultsDirectory;
}

// Construction has no filesystem/network side effects: workers load config
// too. The parent runner calls this only after writing its redacted report.
export const allureReporter: Reporter = {
  name: 'allure',
  async onRunFinished(run, signal) {
    const path = writeAllureResults(run, signal);
    return [{ label: 'Allure results', text: relative(run.projectRoot, path) }];
  },
};
