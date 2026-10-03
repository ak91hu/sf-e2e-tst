import { expect } from 'e2e';
import { test } from '../support/auth-engine.ts';
import { environment } from '../support/environment.ts';
import { test as coreTest } from '../support/core-fixtures.ts';
import { WorkflowPersonas } from '../support/workflow-personas.ts';

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

const workflowTest = coreTest.extend<{ personas: WorkflowPersonas }>({
  personas: async ({ sales, app }, use) => {
    void sales;
    const personas = new WorkflowPersonas(async role => {
      await app.open(new URL(role === 'service'
        ? '/lightning/r/Contract/800000000000001AAA/view?evidence=role-restoration'
        : '/lightning/o/Opportunity/list?evidence=restored-sales', environment.baseUrl).href);
    });
    try { await use(personas); } finally { await personas.restoreForCleanup(); }
  },
});

workflowTest('Allure Service failure capture before Sales cleanup restoration', async ({ browser, screen, personas }) => {
  await browser.route('**/*', route => route.fulfill({ headers: { 'Content-Type': 'text/html' }, body:
    new URL(route.request.url).pathname.startsWith('/lightning/r/Contract/')
      ? '<title>Service Contract</title><h1>Service Contract evidence fixture</h1><button>Edit</button>'
      : '<title>Sales cleanup</title><h1>Restored Sales cleanup identity</h1>' }));
  await personas.service();
  await expect(screen.getByRole('heading', 'Service Contract evidence fixture')).toBeVisible();
  // Deliberately expose an unauthorized action: evidence must retain this UI,
  // even though fixture teardown subsequently navigates to the Sales page.
  await expect(screen.getByRole('button', 'Edit')).toHaveCount(0, { timeout: 500 });
  await personas.sales();
});
