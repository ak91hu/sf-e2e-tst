import { uniqueName } from '../support/data.ts';
import type { SalesUi, SavedRecord } from '../support/sales-ui.ts';

export class AccountPage {
  constructor(private readonly ui: SalesUi) {}
  async create(): Promise<SavedRecord> {
    const record = this.ui.owned.claim('Account', uniqueName('Account')); await this.ui.form('Account'); await this.ui.fill('Account Name', record.name); await this.ui.save(); const saved = await this.ui.resolve(record); await this.ui.open(saved); return saved;
  }

}
