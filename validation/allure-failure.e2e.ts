import { expect } from 'e2e';
import { test } from '../support/auth-engine.ts';
import { environment } from '../support/environment.ts';

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

test('Allure nested authentication URL redaction canary', async ({ browser, salesforceAuth, screen }) => {
  const target = new URL('/secur/contentDoor', environment.baseUrl);
  target.search = new URLSearchParams({ sid: 'synthetic-ui-sid-canary!+/', lm: 'synthetic-ui-content-canary==' }).toString();
  const notice = new URL('/msg/maintenanceandavailable.jsp', environment.baseUrl);
  notice.search = new URLSearchParams({ s: '1791604800000', retURL: target.href }).toString();
  await browser.route('**/*', route => {
    const path = new URL(route.request.url).pathname;
    if (path === '/secur/frontdoor.jsp') return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: `<script>location.replace(${JSON.stringify(notice.href)})</script>` });
    if (path === '/msg/maintenanceandavailable.jsp') return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: `<title>Scheduled Maintenance</title><h1>Future maintenance</h1><a href="${target.href.replaceAll('&', '&amp;')}">Got it</a>` });
    return route.abort();
  });
  await salesforceAuth.open('sales');
  await expect(screen.getByRole('heading', 'Future maintenance')).toBeVisible();
  await expect(screen.getByRole('link', 'Got it')).toHaveText('Intentional nested failure', { timeout: 500 });
});
