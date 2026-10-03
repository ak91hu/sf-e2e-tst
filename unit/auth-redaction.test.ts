import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authRedactionValues, encodedSecretForms, redactAuthUrl } from '../support/auth-redaction.ts';

test('nested Salesforce maintenance redirects redact SID and contentDoor token at every encoding level', () => {
  const inner = new URL('https://example.my.salesforce.com/secur/contentDoor');
  inner.search = new URLSearchParams({ sid: 'nested-session-canary!+/', lm: 'nested-content-canary==', startURL: 'https://example.my.salesforce.com/lightning/o/Opportunity/list' }).toString();
  const outer = new URL('https://example.my.salesforce.com/msg/maintenanceandavailable.jsp');
  outer.search = new URLSearchParams({ s: '1791604800000', retURL: inner.href }).toString();
  const sanitized = redactAuthUrl(outer.href)!;
  assert.doesNotMatch(sanitized, /nested-session-canary|nested-content-canary/);
  assert.equal(new URL(sanitized).searchParams.get('s'), '1791604800000');
  const values = authRedactionValues(outer.href);
  for (const value of encodedSecretForms('nested-session-canary!+/')) assert.ok(values.includes(value));
  assert.ok(values.includes('nested-content-canary=='));
});

test('failure URL keeps exact business location and rejects unsafe origins/credentials', () => {
  const business = 'https://example.my.salesforce.com/lightning/r/Opportunity/006000000000001AAA/view?tab=related';
  assert.equal(redactAuthUrl(business), business);
  assert.equal(redactAuthUrl('https://user:password@example.com'), undefined);
  assert.equal(redactAuthUrl('javascript:alert(1)'), undefined);
});
