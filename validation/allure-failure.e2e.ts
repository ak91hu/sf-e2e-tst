import { expect } from 'e2e';
import { test } from '../support/auth-engine.ts';

// Intentional infrastructure canary, excluded from Salesforce regression.
// Every request is intercepted; no business data or org request is involved.
test('Allure failure evidence canary', async ({ browser, salesforceAuth, screen }) => {
  await browser.route('**/*', route => {
    const path = new URL(route.request.url).pathname;
    if (path === '/secur/frontdoor.jsp') return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<script>location.replace("/lightning/o/Opportunity/list?evidence=canary")</script>' });
    if (path === '/lightning/o/Opportunity/list') return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<!doctype html><title>Allure diagnostic canary</title><h1>Opportunity evidence fixture</h1><button>New</button>' });
    return route.abort();
  });
  await salesforceAuth.open('sales');
  await expect(screen.getByRole('heading', 'Opportunity evidence fixture')).toBeVisible();
  await expect(screen.getByRole('button', 'New')).toHaveText('Intentional failure canary', { timeout: 500 });
});
