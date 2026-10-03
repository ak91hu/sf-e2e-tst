import { test } from '@e2e-dev/web';
import { expect, secrets } from 'e2e';
import { resetUiBridge } from '../support/oauth.ts';

for (const persona of ['sales', 'service'] as const) test(`SF-USER-SETUP | ${persona} initial account setup through UI`, async ({ app, screen, browser }) => {
  resetUiBridge();
  const path = '/__e2e__/oauth-bridge';
  await browser.route(`**${path}`, async route => route.fulfill({ status: 200, headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }, body: '<form action="/secur/frontdoor.jsp" method="get"><label>Token<input name="otp" type="password"></label><label>Checksum<input name="cshc" type="password"></label><input name="startURL" type="hidden" value="lightning/o/Opportunity/list"><button>Sign in</button></form>' }));
  await app.open(path); await screen.getByLabel('Token').fill(secrets.get(persona === 'sales' ? 'salesforceUiToken' : 'serviceUiToken')); await screen.getByLabel('Checksum').fill(secrets.get(persona === 'sales' ? 'salesforceUiChecksum' : 'serviceUiChecksum')); await screen.getByRole('button', 'Sign in').tap();
  await expect(browser).toHaveURL(/(?:\/lightning\/|\/ChangePassword)/);
  if (new URL(await browser.url()).pathname.startsWith('/lightning/')) {
    await expect(screen.getByPlaceholder(/Search this list/i, { visible: true })).toBeVisible(); await browser.unroute(`**${path}`); return;
  }
  await expect(screen.getByRole('heading', 'Change Your Password')).toBeVisible();
  await screen.getByLabel(/Current Password/).fill(secrets.get(`${persona}CurrentPassword`));
  await screen.getByLabel(/^\*?\s*New Password$/).fill(secrets.get(`${persona}NextPassword`));
  await screen.getByLabel(/^\*?\s*New Password$/).press('Space'); await screen.getByLabel(/^\*?\s*New Password$/).press('Backspace');
  await screen.getByLabel(/Confirm New Password/).fill(secrets.get(`${persona}NextPassword`));
  await screen.getByLabel(/Confirm New Password/).press('Space'); await screen.getByLabel(/Confirm New Password/).press('Backspace');
  await screen.getByLabel(/New Answer/).fill(secrets.get(`${persona}Answer`));
  await screen.getByLabel(/New Answer/).press('Tab');
  await screen.getByLabel(/New Security Question/).selectOption("What is your mother's maiden name?");
  await screen.getByLabel(/Current Password/).press('Space'); await screen.getByLabel(/Current Password/).press('Backspace');
  await screen.getByLabel(/New Answer/).press('Space'); await screen.getByLabel(/New Answer/).press('Backspace');
  await screen.getByRole('button', 'Change Password').tap();
  await expect(browser).toHaveURL(/\/lightning\//); await browser.unroute(`**${path}`);
});
