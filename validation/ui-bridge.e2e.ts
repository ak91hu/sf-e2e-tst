import assert from 'node:assert/strict';
import { test } from '../support/auth-engine.ts';
import { expect } from 'e2e';
import { openSalesforceSession } from '../support/ui-login.ts';

for (const native of [false, true]) test(`Synthetic OAuth ${native ? 'native engine' : 'Secret-fill bridge'} authentication`, async ({ app, screen, browser, salesforceAuth }) => {
  let submitted = false;
  // Intercept every request. An unexpected request aborts; nothing reaches the org.
  await browser.route('**/*', async route => {
    const url = new URL(route.request.url);
    if (url.pathname === '/__e2e__/oauth-bridge') return route.continue();
    if (url.pathname === '/secur/frontdoor.jsp') {
      assert.equal(url.searchParams.get('otp'), 'synthetic-ui-otp-canary');
      assert.equal(url.searchParams.get('cshc'), 'synthetic-ui-checksum-canary');
      assert.equal(url.searchParams.get('startURL'), 'lightning/o/Opportunity/list');
      submitted = true;
      // A fulfilled HTTP redirect may bypass Playwright routing for its next
      // request. A synthetic document redirect keeps every request intercepted.
      return route.fulfill({ headers: { 'Content-Type': 'text/html',
        'Set-Cookie': 'synthetic_session=verified; Path=/; Secure; HttpOnly; SameSite=Lax' },
        body: '<!doctype html><script>location.replace("/lightning/o/Opportunity/list")</script>' });
    }
    if (url.pathname === '/lightning/o/Opportunity/list') {
      assert.ok(submitted);
      assert.match(route.request.headers.cookie ?? '', /synthetic_session=verified/);
      return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<!doctype html><title>Test Opportunity list</title><input placeholder="Search this list..."><button>New</button>' });
    }
    return route.abort();
  });
  await openSalesforceSession(app, screen, browser, 'sales', native ? salesforceAuth : undefined);
  await expect(screen.getByRole('button', 'New')).toBeVisible();
  // Both canaries must be redacted from the report and console by the framework.
  console.log('Redaction check: synthetic-ui-otp-canary / synthetic-ui-checksum-canary');
  if (native) await app.screenshot();
});
