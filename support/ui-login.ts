import type { Browser } from '@e2e-dev/web';
import type { App, Screen } from 'e2e';
import { expect, secrets } from 'e2e';
import { environment } from './environment.ts';
import type { SalesforceAuth } from './auth-engine.ts';

export async function openSalesforceSession(app: App, screen: Screen, browser: Browser, persona: 'sales' | 'service' = 'sales', auth?: SalesforceAuth) {
  const path = '/__e2e__/oauth-bridge';
  // This intercepted page contains no tokens. Secret fills register/redact
  // session credentials and suppress screenshots before native navigation.
  await browser.route(`**${path}`, async route => {
    await route.fulfill({ status: 200, headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }, body: `<!doctype html>
      <html lang="en"><head><meta name="referrer" content="no-referrer"><title>E2E authentication</title></head>
      <body><form action="/secur/frontdoor.jsp" method="get" autocomplete="off">
      <label>Salesforce UI token<input type="password" name="otp"></label>
      <label>Salesforce checksum<input type="password" name="cshc"></label>
      <input type="hidden" name="startURL" value="lightning/o/Opportunity/list">
      <button type="submit">Open Salesforce session</button></form></body></html>` });
  });
  try {
    if (auth) await auth.open(persona);
    else {
      // Password/bootstrap maintenance retains the conservative Secret-fill
      // path. Business regression uses the engine's native auth navigation.
      await app.open(path);
      await screen.getByLabel('Salesforce UI token').fill(secrets.get(persona === 'sales' ? 'salesforceUiToken' : 'serviceUiToken'));
      await screen.getByLabel('Salesforce checksum').fill(secrets.get(persona === 'sales' ? 'salesforceUiChecksum' : 'serviceUiChecksum'));
      await screen.getByRole('button', 'Open Salesforce session').tap();
    }
    await expect.poll(async () => {
      const pathname = new URL(await browser.url()).pathname;
      if (pathname === '/msg/maintenanceandavailable.jsp') {
        // A future maintenance notice is an ordinary first-login UI page.
        // Follow its real link; never construct the credential-bearing retURL.
        await screen.getByRole('link', 'Got it', { exact: true, visible: true }).tap();
        return false;
      }
      if (pathname.includes('/identity/') || pathname.includes('/login') || pathname.includes('/ChangePassword') || pathname === '/') {
        throw new Error('Salesforce UI policy requires interactive authentication. Check pre-authorization, UI access and session policies in docs/AUTH_SETUP.md. Regression never waits for an e-mail code.');
      }
      return pathname.startsWith('/lightning/');
    }, { timeout: 60_000 }).toBe(true);
    await browser.goto('/lightning/o/Opportunity/list', { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await expect(screen.getByPlaceholder(/Search this list/i, { visible: true })).toBeVisible();
    if (persona === 'sales') await expect(screen.getByRole('button', 'New', { visible: true })).toBeVisible();
  } finally {
    await browser.unroute(`**${path}`);
  }
}

export async function switchSalesforcePersona(app: App, screen: Screen, browser: Browser, persona: 'sales' | 'service', auth?: SalesforceAuth) {
  // Clear this browser's persisted client state. Logging out would revoke
  // the setup's Salesforce session and invalidate subsequent test restores.
  // clearState reopens the base URL. Use a token-free local auth landing page
  // during that reset so Salesforce's unrelated login marketing iframe cannot
  // hold its load event open. Real JWT/frontdoor authentication follows below.
  const landing = `${environment.baseUrl}/`;
  await browser.route(landing, route => route.fulfill({ status: 200, headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }, body: '<title>Salesforce session reset</title><p>Opening a fresh Salesforce session.</p>' }));
  try { await app.clearState(); } finally { await browser.unroute(landing); }
  await openSalesforceSession(app, screen, browser, persona, auth);
  await verifySalesforcePersona(screen, persona, app);
}

export async function verifySalesforcePersona(screen: Screen, persona: 'sales' | 'service', app?: App) {
  await screen.getByRole('button', 'View profile', { visible: true }).tap();
  await expect(screen.getByText(persona === 'sales' ? 'E2E Sales Manager' : 'E2E Service Manager', { exact: true, visible: true }).first()).toBeVisible();
  // Native business authentication permits masked pixels. Maintenance callers
  // omit app because their Secret-fill bootstrap intentionally forbids them.
  await app?.screenshot(`${persona}-verified-persona`);
  await screen.getByRole('button', 'View profile', { visible: true }).tap();
}
