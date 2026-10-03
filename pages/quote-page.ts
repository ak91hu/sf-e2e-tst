import { expect } from 'e2e';
import { QuoteLineItems } from './components/quote-line-items.ts';
import { environment } from '../support/environment.ts';
import { futureDate, opportunityData, uniqueName, type OpportunityData } from '../support/data.ts';
import type { SalesUi, SavedRecord, Deal, Fields } from '../support/sales-ui.ts';

export class QuotePage {
  readonly lines: QuoteLineItems;
  constructor(private readonly ui: SalesUi) { this.lines = new QuoteLineItems(ui); }
  async closeValidationError() {
    const error = this.ui.screen.getByRole('button', 'Close error dialog', { visible: true });
    await expect(error).toBeVisible(); await error.tap(); await expect(error).not.toBeVisible();
  }
  async assertEmptyRelatedList(deal: Deal) {
    await this.ui.app.open(`/lightning/r/Opportunity/${deal.record.id}/related/Quotes/view`);
    await expect(this.ui.screen.getByRole('heading', 'Quotes', { visible: true })).toBeVisible();
    await expect.poll(() => this.ui.browser.evaluate(() => /\b0 items\b|No records to display|No results found/.test(document.body.innerText))).toBe(true);
  }
  async assertOpportunityLink(deal: Deal) {
    await expect(this.ui.screen.getByRole('link', deal.name, { exact: true, visible: true }).last()).toHaveAttribute('href', new RegExp(`/Opportunity/${deal.record.id}/view$`));
  }
  async sync(record: SavedRecord, enabled: boolean) {
    await this.ui.open(record); await this.ui.screen.getByRole('button', 'Show more actions', { visible: true }).tap();
    await this.ui.screen.getByRole('menuitem', enabled ? 'Start Sync' : 'Stop Sync', { visible: true }).tap();
    const confirmation = this.ui.screen.getByRole('dialog', { visible: true }).filter({ has: this.ui.screen.getByRole('button', 'Continue', { visible: true }) });
    await expect(confirmation).toBeVisible(); await confirmation.getByRole('button', 'Continue').tap(); await expect(confirmation).not.toBeVisible();
    await expect.poll(async () => (await this.ui.read(record)).Syncing).toBe(enabled);
  }
  async create(deal: Deal, label = 'Quote') {
    const record = this.ui.owned.claim('Quote', uniqueName(label)); const expires = futureDate(14); await this.ui.form('Quote', { OpportunityId: deal.record.id }); await this.ui.fill('Quote Name', record.name); await this.ui.date('Expiration Date', expires); await this.ui.fill('Description', 'E2E quote: áéíóöőúüű & values.'); await this.ui.save(); const saved = await this.ui.resolve(record);
    const actual = await this.ui.read(saved); expect(actual).toMatchObject({ Name: record.name, OpportunityName: deal.name, AccountName: deal.account.name, Status: 'Draft', ExpirationDate: expires });
    expect(String(actual['Created By']).split('\n')[0]).toBe(environment.salesName); return { record: saved, deal, expires };
  }

}
