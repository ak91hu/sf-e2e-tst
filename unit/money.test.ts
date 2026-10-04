import assert from 'node:assert/strict';
import { test } from 'node:test';
import { money } from '../support/visible-values.ts';

for (const [text, expected] of [['$0.00', 0], ['$0.01', 0.01], ['$12345.67', 12345.67], ['$1,234,567.89', 1234567.89], ['-$1,234.56', -1234.56]] as const) {
  test(`Visible USD ${text} preserves its numeric value`, () => assert.equal(money(text), expected));
}

for (const text of ['$12,34.56', '$,123.45', '$1,,234.56', '$1,234,56.78', '$1.2', '€1.00', '$NaN', '', ' $1.00 ', '$1.00 trailing']) {
  test(`Malformed or non-USD value ${JSON.stringify(text)} is rejected`, () => assert.throws(() => money(text), /Invalid visible USD amount/));
}
