import { expect } from 'e2e';
import { test } from '../support/auth-engine.ts';
import { environment } from '../support/environment.ts';
import { test as coreTest } from '../support/core-fixtures.ts';
import { WorkflowPersonas } from '../support/workflow-personas.ts';
import assert from 'node:assert/strict';

coreTest('Automatic page-object checkpoint evidence canary', async ({ browser, screen, sales }) => {
  sales.owned.persist = () => {}; // Only intercepted synthetic records, never sandbox data.
  const name = 'E2E-TA-EvidenceAccount';
  const id = '001000000000001AAA';
  await browser.route('**/*', route => {
    const form = /\/(?:new|edit)$/.test(new URL(route.request.url).pathname);
    return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: form
      ? `<title>Account form</title><h1>Account form</h1><div role="dialog" aria-label="Account">
        <label>Account Name<input id="name"></label><p id="error"></p>
        <button onclick="if (!document.getElementById('name').value) document.getElementById('error').textContent='Account Name is required'; else location.href='/lightning/r/Account/${id}/view'">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button></div>`
      : `<title>Account details</title><h1>${name}</h1><button role="tab" aria-selected="false" onclick="this.setAttribute('aria-selected','true')">Details</button>
        <div class="slds-form-element test-id__output-root"><span class="slds-form-element__label">Account Name</span><div class="slds-form-element__control">${name}</div></div>` });
  });
  const record = sales.owned.claim('Account', name);
  await sales.form('Account'); await sales.fill('Account Name', name); await sales.save();
  const saved = await sales.resolve(record);
  expect((await sales.read(saved)).AccountName).toBe(name);
  await sales.form('Account', {}, id); await sales.fill('Account Name', 'E2E-TA-CancelledChange'); await sales.cancel();
  expect((await sales.read(saved)).AccountName).toBe(name);
  await sales.form('Account'); await sales.submit();
  await expect(screen.getByText('Account Name is required', { exact: true })).toBeVisible();
  await sales.cancel();
});

coreTest('Allure successful UI evidence and retained record links canary', async ({ browser, screen, sales, app }) => {
  sales.owned.persist = () => {}; // Synthetic probe must not create sandbox journals.
  await browser.route('**/*', route => route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<title>Retained Salesforce records</title><h1>Opportunity and Quote preserved</h1>' }));
  let deletionActions = 0;
  sales.deleteDialog = async () => { deletionActions++; };
  for (const object of ['Account', 'Contract', 'Case', 'Product2', 'Pricebook2'] as const) {
    await assert.rejects(sales.delete({ object, name: `E2E-TA-${object}`, marker: 'synthetic', id: '001000000000001AAA', deleted: false }), /Deletion forbidden/);
  }
  for (const [object, id] of [['Opportunity', '006000000000001AAA'], ['Quote', '0Q0000000000001AAA']] as const) {
    const record = sales.owned.claim(object, `E2E-TA-Retained${object}`); record.id = id;
    await assert.rejects(sales.delete({ ...record, id }), /Deletion forbidden/);
  }
  assert.equal(deletionActions, 0, 'Retention guard must reject deletion before opening any UI action.');
  await app.open('/lightning/r/Quote/0Q0000000000001AAA/view');
  await expect(screen.getByRole('heading', 'Opportunity and Quote preserved')).toBeVisible();
  await sales.evidence('quote-persisted-details');
  await app.open('/lightning/r/Opportunity/006000000000001AAA/view');
  await expect(screen.getByRole('heading', 'Opportunity and Quote preserved')).toBeVisible();
  await sales.evidence('opportunity-persisted-details');
});

// Intentional infrastructure canary, excluded from Salesforce regression.
// Every request is intercepted; no business data or org request is involved.
test('Allure failure evidence canary', async ({ app, browser, salesforceAuth, screen }) => {
  await browser.route('**/*', route => {
    const path = new URL(route.request.url).pathname;
    if (path === '/secur/frontdoor.jsp') return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<script>location.replace("/lightning/o/Opportunity/list?evidence=canary")</script>' });
    if (path === '/lightning/o/Opportunity/list') return route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<!doctype html><title>Allure diagnostic canary</title><h1>Opportunity evidence fixture</h1><button>New</button>' });
    return route.abort();
  });
  await salesforceAuth.open('sales');
  await expect(screen.getByRole('heading', 'Opportunity evidence fixture')).toBeVisible();
  await app.screenshot('opportunity-list-before-failed-assertion');
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
