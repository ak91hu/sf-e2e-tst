import assert from 'node:assert/strict';
import { test } from '../support/auth-engine.ts';
import { expect } from 'e2e';
import { openSalesforceSession } from '../support/ui-login.ts';
import { environment } from '../support/environment.ts';

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

test('Synthetic native login follows a maintenance notice and redacts nested credentials', async ({ app, screen, browser, salesforceAuth }) => {
  const nested = new URL('/secur/contentDoor', environment.baseUrl);
  nested.search = new URLSearchParams({ sid: 'synthetic-ui-sid-canary!+/', lm: 'synthetic-ui-content-canary==' }).toString();
  const notice = new URL('/msg/maintenanceandavailable.jsp', nested.origin);
  notice.search = new URLSearchParams({ s: '1791604800000', retURL: nested.href }).toString();
  let acknowledged = false;
  await browser.route('**/*', async route => {
    const url = new URL(route.request.url);
    const html = (body: string) => route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<!doctype html>' + body });
    if (url.pathname === '/secur/frontdoor.jsp') return html(`<script>location.replace(${JSON.stringify(notice.href)})</script>`);
    if (url.pathname === '/msg/maintenanceandavailable.jsp') return html(`<title>Scheduled Maintenance</title><p>Future maintenance window</p><a href="${nested.href.replaceAll('&', '&amp;')}">Got it</a>`);
    if (url.pathname === '/secur/contentDoor') {
      assert.equal(url.searchParams.get('sid'), 'synthetic-ui-sid-canary!+/');
      assert.equal(url.searchParams.get('lm'), 'synthetic-ui-content-canary==');
      acknowledged = true;
      return html('<script>location.replace("/lightning/o/Opportunity/list")</script>');
    }
    if (url.pathname === '/lightning/o/Opportunity/list') {
      assert.ok(acknowledged);
      return html('<title>Test Opportunity list</title><input placeholder="Search this list..."><button>New</button>');
    }
    return route.abort();
  });
  await openSalesforceSession(app, screen, browser, 'sales', salesforceAuth);
  await expect(screen.getByRole('button', 'New')).toBeVisible();
  console.log('Nested redaction check: synthetic-ui-sid-canary!+/ / synthetic-ui-content-canary==');
  await app.screenshot();
});
