import { expect } from 'e2e';
import { environment } from '../support/environment.ts';
import { salesforceToday, opportunityData, type OpportunityData } from '../support/data.ts';
import type { SalesUi, SavedRecord, Deal, Fields } from '../support/sales-ui.ts';

export class OpportunityPage {
  constructor(private readonly ui: SalesUi) {}
  async assertListCanCreate() {
    await this.ui.app.open('/lightning/o/Opportunity/list');
    await expect(this.ui.browser).toHaveURL(/\/lightning\/o\/Opportunity\/list/);
    await expect(this.ui.screen.getByRole('button', 'New', { visible: true })).toBeVisible();
  }
  async prepare(account: SavedRecord, label = 'Deal', overrides: Partial<OpportunityData> = {}, omit?: string) {
    const data = { ...opportunityData(account.name, label), stage: environment.stages.initial, ...overrides }; const record = this.ui.owned.claim('Opportunity', data.name);
    await this.ui.form('Opportunity', { AccountId: account.id }); await expect(this.ui.field('Account Name')).toHaveValue(account.name); await this.ui.fill('Opportunity Name', omit === 'Opportunity Name' ? '' : data.name); await this.ui.date('Close Date', omit === 'Close Date' ? '' : data.closeDate);
    await this.ui.choose('Stage', omit === 'Stage' ? '--None--' : data.stage); await this.ui.fill('Amount', data.amount); await this.ui.fill('Description', data.description); return { data, record };
  }
  async create(account: SavedRecord, label = 'Deal', overrides: Partial<OpportunityData> = {}): Promise<Deal> {
    const { data, record } = await this.prepare(account, label, overrides); await this.ui.save(); const saved = await this.ui.resolve(record); const deal = { ...data, record: saved, account }; await this.assert(deal); return deal;
  }
  async assert(deal: Deal, probability?: number) {
    const actual = await this.ui.read(deal.record); await this.assertDealFields(deal, actual, probability); return actual;
  }
  private async assertDealFields(deal: Deal, actual: Fields, probability?: number) {
    expect(actual).toMatchObject({ Name: deal.name, AccountName: deal.account.name, CloseDate: deal.closeDate, StageName: deal.stage, Description: deal.description }); expect(actual.Amount).toBeCloseTo(deal.amount, 2);
    await expect(this.ui.screen.getByRole('link', deal.account.name, { exact: true, visible: true }).last()).toHaveAttribute('href', new RegExp(`/Account/${deal.account.id}/view$`));
    expect(String(actual['Opportunity Owner']).split('\n')[0]).toBe(environment.salesName); expect(String(actual['Created By']).split('\n')[0]).toBe(environment.salesName); if (probability !== undefined) expect(actual.Probability).toBe(probability);
  }
  async changeStage(deal: Deal, stage: string, probability?: number): Promise<Deal> {
    const before = salesforceToday(); await this.ui.form('Opportunity', {}, deal.record.id); await this.ui.choose('Stage', stage); await this.ui.save(); const after = salesforceToday(); const actual = await this.ui.read(deal.record); expect(actual.StageName).toBe(stage);
    expect(stage === environment.stages.won ? [before, after].map(today => deal.closeDate > today ? today : deal.closeDate) : [deal.closeDate]).toContain(actual.CloseDate); const updated = { ...deal, stage, closeDate: actual.CloseDate as string }; await this.assertDealFields(updated, actual, probability); return updated;
  }

}
