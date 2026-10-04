import { expect } from 'e2e';
import { environment } from '../support/environment.ts';
import { futureDate, uniqueName } from '../support/data.ts';
import type { SalesUi, SavedRecord } from '../support/sales-ui.ts';

export class ContractPage {
  constructor(private readonly ui: SalesUi) {}
  async assertReadOnly() {
    await expect(this.ui.screen.getByRole('button', 'Edit', { visible: true })).toHaveCount(0);
    await expect(this.ui.screen.getByRole('button', 'Delete', { visible: true })).toHaveCount(0);
    await this.ui.evidence('service-contract-read-only');
  }
  async create(account: SavedRecord, term = 12) {
    const record = this.ui.owned.claim('Contract', uniqueName('Contract'), undefined, account.name); const startDate = futureDate(0); const specialTerms = 'E2E terms: áéíóöőúüű & conditions.';
    await this.ui.form('Contract', { AccountId: account.id }); await this.ui.date('Contract Start Date', startDate); await this.ui.fill('Contract Term (months)', term); await this.ui.fill('Description', record.marker); await this.ui.fill('Special Terms', specialTerms); await this.ui.save(); const saved = await this.ui.resolve(record);
    const actual = await this.ui.read(saved); expect(actual).toMatchObject({ AccountName: account.name, StartDate: startDate, ContractTerm: term, Status: 'Draft', Description: record.marker, SpecialTerms: specialTerms });
    expect(String(actual['Created By']).split('\n')[0]).toBe(environment.salesName); return { record: saved, account, startDate, term, specialTerms };
  }
  private async activationDialog(record: SavedRecord) {
    await this.ui.open(record); await this.ui.screen.getByRole('button', 'Show more actions', { visible: true }).tap(); await this.ui.screen.getByRole('menuitem', 'Activate', { visible: true }).tap();
    await expect(this.ui.confirmation('Activate').getByRole('button', 'Activate')).toBeVisible();
  }
  async cancelActivation(record: SavedRecord) {
    await this.activationDialog(record); await this.ui.cancel();
    const actual = await this.ui.read(record); expect(actual.Status).toBe('Draft'); return actual;
  }
  async activate(record: SavedRecord) {
    await this.activationDialog(record); await this.ui.confirmation('Activate').getByRole('button', 'Activate').tap(); await expect(this.ui.confirmation('Activate')).not.toBeVisible();
    const actual = await this.ui.read(record); expect(actual.Status).toBe('Activated'); expect(String(actual.ActivatedBy).split('\n')[0]).toBe(environment.salesName); expect(actual.ActivatedDate).toBeTruthy(); return actual;
  }

}
