import assert from 'node:assert/strict';
import { test } from 'node:test';
import { futureDate, opportunityData, salesforceToday, TEST_PREFIX, uniqueName } from '../support/data.ts';

test('Fixture names preserve Unicode labels and stay unique within one millisecond', t => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.UTC(2026, 0, 1) });
  const names = Array.from({ length: 100 }, () => uniqueName('Árvíztűrő & Quote'));
  assert.equal(new Set(names).size, 100);
  assert.ok(names.every(name => name.startsWith(`${TEST_PREFIX}Árvíztűrő & Quote-`)));
});

for (const [today, offset, expected] of [
  ['2028-02-28T23:59:59Z', 1, '2028-02-29'],
  ['2028-02-28T23:59:59Z', 2, '2028-03-01'],
  ['2026-12-31T23:59:59Z', 1, '2027-01-01'],
  ['2026-01-01T00:00:01Z', -1, '2025-12-31'],
  ['2026-03-29T00:30:00Z', 0, '2026-03-29'],
] as const) {
  test(`UTC fixture date: ${today} plus ${offset} days is ${expected}`, t => {
    t.mock.timers.enable({ apis: ['Date'], now: Date.parse(today) });
    assert.equal(futureDate(offset), expected);
  });
}

test('Closed Won calendar date follows Budapest across UTC midnight and DST', t => {
  const previous = process.env.SF_TIME_ZONE;
  t.after(() => { if (previous === undefined) delete process.env.SF_TIME_ZONE; else process.env.SF_TIME_ZONE = previous; });
  process.env.SF_TIME_ZONE = 'Europe/Budapest';
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-07-01T22:30:00Z') });
  assert.equal(salesforceToday(), '2026-07-02');
  t.mock.timers.setTime(Date.parse('2026-01-01T22:30:00Z'));
  assert.equal(salesforceToday(), '2026-01-01');
});

test('Opportunity defaults keep exact Account identity, cents and a 30-day close date', t => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-12-15T12:00:00Z') });
  const data = opportunityData('E2E-TA-Account á & co', 'Renewal');
  assert.equal(data.accountName, 'E2E-TA-Account á & co');
  assert.match(data.name, /^E2E-TA-Renewal-/);
  assert.equal(data.closeDate, '2027-01-14');
  assert.equal(data.amount, 12_345.67);
  assert.equal(data.stage, '');
  assert.ok(data.description);
});
