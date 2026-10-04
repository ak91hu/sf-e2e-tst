import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { writeAllureResults } from '../reporting/allure.ts';
import { attempt, fixture, png, result, retained } from './report-fixture.ts';

test('Passed results export named checkpoint PNGs, completion evidence, journals and exact record links', () => {
  const probe = fixture();
  const records = [retained(), retained('Quote', '0Q0000000000001AAA')];
  probe.run.report.run.results[0].attempts = [attempt({ artifacts: [
    probe.artifact('attempt/screenshots/001-form-before-save.png'),
    probe.artifact('attempt/screenshots/002-Quote-persisted-details.png'),
    probe.artifact('attempt/screenshots/003-test-completion-evidence.png'),
    probe.artifact('attempt/retained-records.json', JSON.stringify({ retention: 'permanent', records }), { kind: 'log', mediaType: 'application/json' }),
  ] })];
  const { output, results: [exported] } = probe.export();
  assert.equal(exported.status, 'passed');
  assert.deepEqual(exported.attachments.filter(item => item.type === 'image/png').map(item => item.name), [
    'UI evidence: 001-form-before-save', 'UI evidence: 002-Quote-persisted-details', 'Screenshot of successful UI run',
  ]);
  for (const attachment of exported.attachments.filter(item => item.type === 'image/png')) assert.deepEqual(readFileSync(resolve(output, attachment.source)), png);
  assert.deepEqual(exported.links.map(link => link.url), records.map(record => record.url));
  const log = exported.attachments.find(item => item.name === 'Detailed attempt log')!;
  assert.equal(JSON.parse(readFileSync(resolve(output, log.source), 'utf8')).status, 'passed');
});

test('Failed results keep pre-failure checkpoints and the original failure PNG/URL', () => {
  const probe = fixture();
  const screenshot = probe.artifact('attempt/screenshots/002-failure.png');
  probe.run.report.run.results[0].attempts = [attempt({ status: 'failed', error: { category: 'test', code: 'ASSERTION_FAILED', message: 'Wrong stage', retryable: false },
    failure: { screenshot: screenshot.id, url: 'https://example.my.salesforce.com/lightning/r/Opportunity/006000000000001AAA/view?tab=related' },
    artifacts: [probe.artifact('attempt/screenshots/001-stage-before-change.png'), screenshot, probe.artifact('attempt/screenshots/003-test-completion-evidence.png')],
  })];
  const { results: [exported] } = probe.export();
  assert.equal(exported.status, 'failed');
  assert.equal(exported.attachments.filter(item => item.type === 'image/png').length, 3);
  assert.ok(exported.attachments.some(item => item.name === 'UI evidence: 001-stage-before-change'));
  assert.ok(exported.attachments.some(item => item.name === 'Screenshot at failure'));
  assert.ok(exported.attachments.some(item => item.name === 'UI evidence: 003-test-completion-evidence'));
  assert.ok(!exported.attachments.some(item => item.name === 'Screenshot of successful UI run'));
  assert.equal(exported.links[0].url, 'https://example.my.salesforce.com/lightning/r/Opportunity/006000000000001AAA/view?tab=related');
});

test('Retries keep separate evidence, statuses and UUIDs with a common history identity', () => {
  const probe = fixture();
  probe.run.report.run.results[0].status = 'flaky';
  probe.run.report.run.results[0].attempts = [
    attempt({ status: 'failed', error: { category: 'test', code: 'ASSERTION_FAILED', message: 'First attempt', retryable: false }, artifacts: [probe.artifact('first/screenshots/001-before-retry.png')] }),
    attempt({ index: 1, artifacts: [probe.artifact('second/screenshots/001-test-completion-evidence.png')] }),
  ];
  const { results } = probe.export();
  assert.equal(results.length, 2);
  assert.deepEqual(results.map(item => item.status).sort(), ['failed', 'passed']);
  assert.equal(new Set(results.map(item => item.uuid)).size, 2);
  assert.equal(new Set(results.map(item => item.historyId)).size, 1);
  assert.ok(results.find(item => item.status === 'failed')!.attachments.some(item => item.name.includes('before-retry')));
  assert.ok(!results.find(item => item.status === 'passed')!.attachments.some(item => item.name.includes('before-retry')));
  const manifest = JSON.parse(readFileSync(resolve(probe.directory, 'allure-results/current.json'), 'utf8'));
  assert.equal(manifest.selectedTests, 1); assert.equal(manifest.resultFiles, 2);
});

test('Selection excludes unrelated cases while preserving a selected unexecuted skip', () => {
  const probe = fixture([result({ selected: false }), result({ status: 'skipped', attempts: [], skip: { reason: 'Feature unavailable', cause: 'explicit' } })]);
  const { results } = probe.export();
  assert.equal(results.length, 1); assert.equal(results[0].status, 'skipped');
  assert.equal(results[0].statusDetails.message, 'Feature unavailable');
  assert.deepEqual(results[0].attachments, []);
});

test('Only fully redacted PNGs and allowlisted text logs become attachments', () => {
  const probe = fixture();
  probe.run.report.run.results[0].attempts = [attempt({ artifacts: [
    probe.artifact('attempt/safe.png'),
    probe.artifact('attempt/not-redacted.png', png, { redaction: 'incomplete' }),
    probe.artifact('attempt/raw.png', png, { redaction: 'not-required' }),
    probe.artifact('attempt/video.webm', 'private-video', { kind: 'video', mediaType: 'video/webm' }),
    probe.artifact('attempt/trace.zip', 'private-trace', { kind: 'trace', mediaType: 'application/zip' }),
    probe.artifact('attempt/download.txt', 'private-download', { kind: 'download', mediaType: 'text/plain' }),
    probe.artifact('attempt/wrong-format.jpg', png, { mediaType: 'image/jpeg' }),
  ] })];
  const { results: [exported] } = probe.export();
  assert.deepEqual(exported.attachments.map(item => item.name), ['Detailed attempt log', 'UI evidence: safe']);
});

test('PNG evidence larger than 4 MiB is preserved instead of silently dropped', () => {
  const probe = fixture();
  const bytes = Buffer.concat([png, Buffer.alloc(4 * 1024 * 1024)]);
  probe.run.report.run.results[0].attempts = [attempt({ artifacts: [probe.artifact('attempt/large.png', bytes)] })];
  const { output, results: [exported] } = probe.export();
  const screenshot = exported.attachments.find(item => item.type === 'image/png')!;
  assert.ok(screenshot); assert.deepEqual(readFileSync(resolve(output, screenshot.source)), bytes);
});

test('Artifact traversal cannot copy evidence from outside the current run', () => {
  const probe = fixture();
  probe.run.report.run.results[0].attempts = [attempt({ artifacts: [probe.artifact('../foreign.png')] })];
  assert.throws(() => probe.export(), /outside this run artifact directory/);
});

for (const [label, record] of [
  ['foreign origin', { ...retained(), url: 'https://foreign.example/lightning/r/Opportunity/006000000000001AAA/view' }],
  ['mismatched ID', { ...retained(), id: '006000000000002AAA' }],
  ['unsupported object', retained('User', '005000000000001AAA')],
  ['invalid ID', retained('Opportunity', 'not-an-id')],
  ['query parameters', { ...retained(), url: `${retained().url}?sid=synthetic-secret` }],
  ['URL fragment', { ...retained(), url: `${retained().url}#fragment` }],
] as const) {
  test(`Retained-record links reject ${label}`, () => {
    const probe = fixture();
    probe.run.report.run.results[0].attempts = [attempt({ artifacts: [probe.artifact('attempt/retained-records.json', JSON.stringify({ retention: 'permanent', records: [record] }), { kind: 'log', mediaType: 'application/json' })] })];
    assert.throws(() => probe.export(), /Invalid retained Salesforce record link/);
  });
}

test('Cancelled reporting respects its abort signal before exporting a result', () => {
  const probe = fixture();
  const controller = new AbortController(); controller.abort(new Error('Reporter deadline'));
  assert.throws(() => writeAllureResults(probe.run, controller.signal), /Reporter deadline/);
});

test('Reporter requires a completed report path and a safe run identity', () => {
  const probe = fixture();
  assert.throws(() => writeAllureResults({ ...probe.run, reportPath: undefined }), /completed e2e report/);
  probe.run.report.run.id = '../other-run';
  assert.throws(() => probe.export(), /Invalid e2e run identifier/);
});
