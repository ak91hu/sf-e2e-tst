import { AccountPage } from '../pages/account-page.ts';
import { OpportunityPage } from '../pages/opportunity-page.ts';
import { ContractPage } from '../pages/contract-page.ts';
import { QuotePage } from '../pages/quote-page.ts';
import { ServicePage } from '../pages/service-page.ts';
import { CatalogPage } from '../pages/catalog-page.ts';
import type { App, Screen } from 'e2e';
import { expect } from 'e2e';
import type { Browser } from '@e2e-dev/web';
import { z } from 'zod';
import { environment } from './environment.ts';
import type { OpportunityData } from './data.ts';
import { UiRecords, type UiRecord, type UiObject } from './ui-records.ts';
import { choosePicklist } from '../pages/components/picklist.ts';

export type SavedRecord = UiRecord & { id: string };
export type Deal = OpportunityData & { record: SavedRecord; account: SavedRecord };
export type Fields = Record<string, string | number | boolean>;
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const uiDate = (iso: string) => { const [year, month, day] = iso.split('-'); return `${Number(month)}/${Number(day)}/${year}`; };
const isoDate = (text: string) => { const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text); if (!match) throw new Error(`Invalid visible date: ${text}`); return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`; };
export const money = (text: string) => { if (!/^-?\$[\d,]+\.\d{2}$/.test(text)) throw new Error(`Invalid visible USD amount: ${text}`); return Number(text.replace(/[$,]/g, '')); };
const prefixes: Record<UiObject, string> = { Account: '001', Opportunity: '006', Contract: '800', Quote: '0Q0', Product2: '01t', Pricebook2: '01s', Case: '500' };

export class SalesUi {
  readonly accounts: AccountPage;
  readonly opportunities: OpportunityPage;
  readonly contracts: ContractPage;
  readonly quotes: QuotePage;
  readonly service: ServicePage;
  readonly catalog: CatalogPage;
  readonly owned = new UiRecords();
  readonly app: App;
  constructor(app: App, readonly screen: Screen, readonly browser: Browser) {
    // Lightning is ready when its DOM and the expected controls are ready.
    // A slow secondary resource must not consume the entire test deadline.
    this.app = { ...app, open: path => browser.goto(path ?? '/', { waitUntil: 'domcontentloaded', timeout: 45_000 }) };
    this.accounts = new AccountPage(this);
    this.opportunities = new OpportunityPage(this);
    this.contracts = new ContractPage(this);
    this.quotes = new QuotePage(this);
    this.service = new ServicePage(this);
    this.catalog = new CatalogPage(this);
  }
  dialog() { return this.screen.getByRole('dialog', { visible: true }).filter({ has: this.screen.getByRole('button', 'Save', { visible: true }) }); }
  confirmation(action = 'Delete') { return this.screen.getByRole('dialog', { visible: true }).filter({ has: this.screen.getByRole('button', action, { visible: true }) }); }
  field(label: string) { return this.dialog().getByLabel(new RegExp(`^\\*?\\s*${escape(label)}$`, 'i'), { visible: true }); }
  async fill(label: string, value: string | number) {
    const field = this.field(label);
    if (typeof value === 'number' && await field.inputValue()) {
      // Salesforce smart-number inputs can retain the previous value when a
      // synthetic fill replaces it. Real selection/deletion updates their model.
      await field.focus();
      // Keep both keys on the focused input. Resolving a Lightning locator
      // again between select-all and Backspace can reset the selection.
      await this.browser.keyboard.press('ControlOrMeta+A'); await this.browser.keyboard.press('Backspace');
      await expect(field).toHaveValue('');
    }
    await field.fill(String(value));
    if (typeof value === 'number') {
      // Lightning can format a number as USD before or after focus changes.
      // Compare the visible numeric value, rejecting empty/malformed input.
      await expect.poll(async () => {
        const actual = (await field.inputValue()).trim();
        if (label === 'Probability (%)' && /^\d+(?:\.\d+)?%$/.test(actual)) return Number(actual.slice(0, -1));
        return /^-?\$?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/.test(actual)
          ? Number(actual.replace(/[$,]/g, '')) : Number.NaN;
      }).toBe(value);
    } else await expect(field).toHaveValue(value);
  }
  async date(label: string, iso: string) { await this.fill(label, iso ? uiDate(iso) : ''); }
  async choose(label: string, value: string) {
    const control = this.dialog().getByRole('combobox', new RegExp(`^\\*?\\s*${escape(label)}$`, 'i'), { visible: true });
    await choosePicklist(this.screen, control, value);
  }
  async form(object: UiObject, defaults: Fields = {}, id?: string) {
    if (object === 'Opportunity' && !id && this.isConfigurationAdministrator()) throw new Error('Opportunity creation by the configuration administrator is forbidden. Use the Sales Manager persona.');
    const query = new URLSearchParams(); if (Object.keys(defaults).length) query.set('defaultFieldValues', Object.entries(defaults).map(([key, value]) => `${key}=${value}`).join(','));
    if (environment.recordType && object === 'Opportunity') query.set('recordTypeId', environment.recordType);
    await this.app.open(id ? `/lightning/r/${object}/${id}/edit` : `/lightning/o/${object}/new?${query}`); await expect(this.dialog().getByRole('button', 'Save', { visible: true })).toBeVisible();
  }
  private isConfigurationAdministrator() { return Boolean(process.env.SF_USERNAME && environment.username === process.env.SF_USERNAME); }
  async submit() { await this.dialog().getByRole('button', 'Save').tap(); }
  async save() { await this.submit(); await expect(this.dialog()).not.toBeVisible(); }
  async cancel() {
    const errors = this.screen.getByRole('button', 'Close error dialog', { visible: true }); if (await errors.count()) await errors.tap();
    const dialogs = this.screen.getByRole('dialog', { visible: true }); const cancel = dialogs.getByRole('button', 'Cancel', { visible: true });
    await expect(cancel).toHaveCount(1); await cancel.tap(); await expect(dialogs).not.toBeVisible();
  }
  async resolve(record: UiRecord): Promise<SavedRecord> {
    await expect(this.browser).toHaveURL(new RegExp(`/lightning/r/(?:${record.object}/)?${prefixes[record.object]}[A-Za-z0-9]{12,15}/view(?:\\?.*)?$`));
    record.id = new URL(await this.browser.url()).pathname.split('/').at(-2)!; this.owned.persist();
    if (record.object === 'Contract') { const heading = this.screen.getByRole('heading', /^Contract\s+\d+$/, { visible: true }); await expect(heading).toBeVisible(); record.displayName = (await heading.textContent())!.replace(/^Contract\s+/, '').trim(); }
    this.owned.persist(); return record as SavedRecord;
  }
  async open(record: SavedRecord) {
    if (!this.owned.records.includes(record) || record.deleted) throw new Error('Record is not owned by this attempt.');
    await this.app.open(`/lightning/r/${record.object}/${record.id}/view`); await expect(this.browser).toHaveURL(new RegExp(`/lightning/r/${record.object}/${record.id}/view(?:\\?.*)?$`));
    if (!['Contract', 'Case'].includes(record.object)) await expect(this.screen.getByRole('heading', new RegExp(`^(?:${record.object === 'Product2' ? 'Product' : record.object === 'Pricebook2' ? 'Price Book' : record.object}\\s+)?${escape(record.name)}$`), { visible: true })).toBeVisible();
    else if (record.object === 'Contract' && record.displayName) await expect(this.screen.getByRole('heading', new RegExp(`^Contract\\s+${escape(record.displayName)}$`), { visible: true })).toBeVisible();
    else await expect(this.screen.getByRole('button', 'Show more actions', { visible: true })).toBeVisible();
  }
  async details(record: SavedRecord) {
    // open() already loads a fresh document through native browser navigation.
    await this.open(record); const tab = this.screen.getByRole('tab', 'Details', { visible: true }); await tab.tap(); await expect(tab).toBeSelected();
    const labels: Record<UiObject, string> = { Account: 'Account Name', Opportunity: 'Opportunity Name', Quote: 'Quote Name', Contract: 'Contract Number', Case: 'Subject', Product2: 'Product Name', Pricebook2: 'Price Book Name' };
    await expect.poll(async () => (await this.visibleFields())[labels[record.object]], { timeout: 30_000 }).toBeTruthy();
    if (record.object === 'Contract') { const fields = await this.visibleFields(); expect(fields.Description).toBe(record.marker); record.displayName = fields['Contract Number']; this.owned.persist(); }
    if (record.object === 'Case') { const fields = await this.visibleFields(); expect(fields.Subject).toBe(record.name); expect(fields.Description).toBe(record.marker); record.displayName = fields['Case Number']; this.owned.persist(); }
  }
  // Read only visible DOM fields. No fetch, application state or Salesforce API.
  async visibleFields(): Promise<Record<string, string>> {
    return z.record(z.string(), z.string()).parse(await this.browser.evaluate(() => {
      const elements: Element[] = []; const roots = new Set<Document | ShadowRoot>(); const seen = new Set<Element>();
      const visit = (root: Document | ShadowRoot) => {
        if (roots.has(root)) return; roots.add(root);
        for (const element of root.querySelectorAll('*')) { if (seen.has(element)) continue; seen.add(element); elements.push(element); if (elements.length > 20000) throw new Error('Visible UI traversal exceeded 20000 unique elements.'); if (element.shadowRoot) visit(element.shadowRoot); }
      }; visit(document);
      const fields: Record<string, string> = {};
      for (const element of elements.filter(element => element.matches('.slds-form-element.test-id__output-root') && element.getBoundingClientRect().height > 0)) {
        const label = element.querySelector('.slds-form-element__label')?.textContent?.trim(); const control = element.querySelector('.slds-form-element__control') as HTMLElement | null; if (!label || !control) continue;
        const buttons: HTMLElement[] = [];
        const buttonRoots = new Set<Element | ShadowRoot>(); const buttonElements = new Set<Element>();
        const visitButtons = (root: Element | ShadowRoot) => { if (buttonRoots.has(root)) return; buttonRoots.add(root); for (const child of root.querySelectorAll('*')) { if (buttonElements.has(child)) continue; buttonElements.add(child); if (child.tagName === 'BUTTON') buttons.push(child as HTMLElement); if (child.shadowRoot) visitButtons(child.shadowRoot); } };
        visitButtons(control);
        let value = control.innerText.trim();
        for (const button of buttons.reverse()) { const text = button.innerText.trim() || button.getAttribute('aria-label') || button.getAttribute('title') || ''; if (text && value.endsWith(text)) value = value.slice(0, -text.length).trim(); }
        fields[label] = value;
      }
      return fields;
    }));
  }
  async read(record: SavedRecord): Promise<Fields> {
    await this.details(record); const fields = await this.visibleFields(); const actual: Fields = { ...fields };
    for (const [label, key] of Object.entries({ 'Opportunity Name': 'Name', 'Quote Name': 'Name', 'Account Name': 'AccountName', Stage: 'StageName', Status: 'Status', Description: 'Description', 'Special Terms': 'SpecialTerms', 'Activated By': 'ActivatedBy', 'Activated Date': 'ActivatedDate', 'Contract Number': 'ContractNumber' })) if (fields[label] !== undefined) actual[key] = fields[label];
    if (record.object === 'Quote') { actual.Name = fields['Quote Name']; actual.OpportunityName = fields['Opportunity Name']; }
    if (typeof actual.AccountName === 'string') actual.AccountName = actual.AccountName.split('\n')[0];
    if (typeof actual.OpportunityName === 'string') actual.OpportunityName = actual.OpportunityName.split('\n')[0];
    for (const [label, key] of [['Close Date', 'CloseDate'], ['Contract Start Date', 'StartDate'], ['Contract End Date', 'EndDate'], ['Expiration Date', 'ExpirationDate']]) if (fields[label]) actual[key] = isoDate(fields[label]);
    for (const [label, key] of [['Amount', 'Amount'], ['Subtotal', 'Subtotal'], ['Total Price', 'TotalPrice'], ['Grand Total', 'GrandTotal'], ['Tax', 'Tax'], ['Shipping and Handling', 'ShippingHandling']]) if (fields[label]) actual[key] = money(fields[label]);
    if (fields['Probability (%)']) actual.Probability = Number(fields['Probability (%)'].replace('%', '')); if (fields['Contract Term (months)']) actual.ContractTerm = Number(fields['Contract Term (months)']);
    if (fields.Syncing) actual.Syncing = fields.Syncing.split('\n')[0] === 'True'; return actual;
  }
  async assertNameAbsent(object: UiObject, name: string, renamedName?: string) {
    if (!name) throw new Error('UI absence assertion requires an exact owned name.');
    const views: Record<UiObject, string> = { Account: 'AllAccounts', Opportunity: 'AllOpportunities', Contract: 'AllContracts', Quote: 'Recent', Product2: 'Recent', Pricebook2: 'Recent', Case: 'AllOpenCases' };
    await this.app.open(`/lightning/o/${object}/list?filterName=${views[object]}`); const search = this.screen.getByPlaceholder(/Search this list/i, { visible: true }); await expect(search).toBeVisible(); await search.fill(name); await search.press('Enter'); await expect(search).toHaveValue(name);
    await expect.poll(async () => await this.browser.evaluate(() => /(?:\b0 items\b|No results found|No records to display|Nothing to see here)/i.test(document.body.innerText))
      || Boolean(renamedName && await this.screen.getByRole('link', renamedName, { exact: true, visible: true }).count()), { timeout: 30_000 }).toBe(true);
    await expect(this.screen.getByRole('link', name, { exact: true, visible: true })).toHaveCount(0);
  }
  async assertAbsent(record: UiRecord) { await this.assertNameAbsent(record.object, record.object === 'Contract' ? record.displayName || record.accountName! : record.name); if (!record.id) this.owned.markDeleted(record); }
  async deleteDialog(record: SavedRecord) {
    await this.details(record); const direct = this.screen.getByRole('button', 'Delete', { visible: true });
    if (['Contract', 'Quote', 'Product2', 'Pricebook2'].includes(record.object)) { await expect(direct).toBeVisible(); await direct.tap(); }
    else if (await direct.count() === 1) await direct.tap();
    else { await this.screen.getByRole('button', 'Show more actions', { visible: true }).tap(); await this.screen.getByRole('menuitem', 'Delete', { visible: true }).tap(); }
    await expect(this.confirmation().getByRole('button', 'Delete', { visible: true })).toBeVisible();
  }
  async delete(record: SavedRecord) {
    throw new Error(`Deletion forbidden: preserve sandbox ${record.object} ${record.id}.`);
  }
}
