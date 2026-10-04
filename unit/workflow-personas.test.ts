import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WorkflowPersonas } from '../support/workflow-personas.ts';

test('Sales-only workflow needs no extra login during retention teardown', async () => {
  const calls: string[] = [];
  const personas = new WorkflowPersonas(async role => { calls.push(role); });
  await personas.restoreForCleanup();
  assert.deepEqual(calls, []);
});

test('Service workflow restores Sales once after failure evidence is captured', async () => {
  const calls: string[] = [];
  const personas = new WorkflowPersonas(async role => { calls.push(role); });
  await personas.service();
  calls.push('failure-evidence');
  await personas.restoreForCleanup();
  await personas.restoreForCleanup();
  assert.deepEqual(calls, ['service', 'failure-evidence', 'sales']);
});

test('Explicit Sales switch prevents a redundant teardown switch', async () => {
  const calls: string[] = [];
  const personas = new WorkflowPersonas(async role => { calls.push(role); });
  await personas.service(); await personas.sales(); await personas.restoreForCleanup();
  assert.deepEqual(calls, ['service', 'sales']);
});

test('Failed Service navigation still schedules Sales restoration', async () => {
  const calls: string[] = [];
  const personas = new WorkflowPersonas(async role => { calls.push(role); if (role === 'service') throw new Error('Service navigation failed'); });
  await assert.rejects(personas.service(), /Service navigation failed/);
  await personas.restoreForCleanup();
  assert.deepEqual(calls, ['service', 'sales']);
});

test('Failed Sales restoration remains pending for the next restoration attempt', async () => {
  let salesCalls = 0;
  const personas = new WorkflowPersonas(async role => { if (role === 'sales' && ++salesCalls === 1) throw new Error('Sales navigation failed'); });
  await personas.service();
  await assert.rejects(personas.restoreForCleanup(), /Sales navigation failed/);
  await personas.restoreForCleanup(); await personas.restoreForCleanup();
  assert.equal(salesCalls, 2);
});
