import assert from 'node:assert/strict';
import { test } from 'node:test';
import { UiRecords } from '../support/ui-records.ts';

class JournalProbe extends UiRecords { override persist() {} }

test('Failed rename cleanup accepts only exact recorded names for the same owned ID', () => {
  const owned = new JournalProbe(async () => {});
  const record = owned.claim('Opportunity', 'E2E-TA-Original'); record.id = '006000000000001AAA';
  owned.rename(record, 'E2E-TA-Updated');
  owned.reconcileName(record, 'E2E-TA-Original'); // The edit never saved.
  assert.equal(record.name, 'E2E-TA-Original');
  owned.rename(record, 'E2E-TA-Updated');
  owned.reconcileName(record, 'E2E-TA-Updated'); // Save completed before failure.
  assert.equal(record.name, 'E2E-TA-Updated');
  assert.throws(() => owned.reconcileName(record, 'E2E-TA-Unrelated'));
  assert.throws(() => owned.reconcileName({ ...record }, record.name));
  assert.throws(() => owned.rename(record, 'Unowned name'));
  record.previousNames = ['Unrelated business record'];
  assert.throws(() => owned.reconcileName(record, 'Unrelated business record'));
});
