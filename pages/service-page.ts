import { expect } from 'e2e';
import { uniqueName } from '../support/data.ts';
import type { SalesUi, SavedRecord } from '../support/sales-ui.ts';

export class ServicePage {
  constructor(private readonly ui: SalesUi) {}
  async assertCannotCreateOpportunity() {
    await this.ui.app.open('/lightning/o/Opportunity/list');
    await expect(this.ui.screen.getByPlaceholder(/Search this list/i, { visible: true })).toBeVisible();
    await expect(this.ui.screen.getByRole('button', 'New', { visible: true })).toHaveCount(0);
    await this.ui.app.open('/lightning/o/Opportunity/new');
    await expect(this.ui.screen.getByText(/(?:insufficient privileges|don't have the necessary privileges|don't have access|do not have access|don't have permission|do not have permission)/i, { visible: true }).first()).toBeVisible();
    await expect(this.ui.dialog()).not.toBeVisible();
  }
  async createCase(account: SavedRecord) {
    const record = this.ui.owned.claim('Case', uniqueName('ServiceCase'));
    await this.ui.form('Case', { AccountId: account.id }); await this.ui.fill('Subject', record.name);
    await this.ui.choose('Status', 'New'); await this.ui.choose('Case Origin', 'Phone'); await this.ui.fill('Description', record.name);
    await this.ui.save(); return this.ui.resolve(record);
  }
  async changeCaseStatus(record: SavedRecord, status: string) {
    await this.ui.form('Case', {}, record.id); await this.ui.choose('Status', status); await this.ui.save();
  }
}
