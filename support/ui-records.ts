import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { environment } from './environment.ts';
import { uniqueName } from './data.ts';

export type UiObject = 'Account' | 'Opportunity' | 'Contract' | 'Quote' | 'Product2' | 'Pricebook2' | 'Case';
export interface UiRecord { object: UiObject; name: string; marker: string; id?: string; displayName?: string; accountName?: string; previousNames?: string[]; deleted: boolean }
export class UiRecords {
  readonly records: UiRecord[] = [];
  readonly journal = resolve('.e2e-data', `${uniqueName('attempt')}.json`);
  private readonly remove: (record: UiRecord) => Promise<void>;
  constructor(remove: (record: UiRecord) => Promise<void>) { this.remove = remove; }
  persist() { mkdirSync(resolve('.e2e-data'), { recursive: true }); writeFileSync(this.journal, JSON.stringify({ org: environment.baseUrl, mode: 'ui', records: this.records }, null, 2)); }
  claim(object: UiObject, name: string, marker = name, accountName?: string): UiRecord {
    if (!name.startsWith('E2E-TA-')) throw new Error('UI fixtures must use this attempt test prefix.');
    const record = { object, name, marker, accountName, deleted: false }; this.records.push(record); this.persist(); return record;
  }
  rename(record: UiRecord, name: string) {
    if (!this.records.includes(record) || !['Opportunity', 'Quote'].includes(record.object) || !name.startsWith('E2E-TA-')) throw new Error('Invalid owned fixture rename.');
    record.previousNames = [...new Set([...(record.previousNames ?? []), record.name])];
    record.name = name; record.marker = name; record.displayName = name; this.persist();
  }
  reconcileName(record: UiRecord, visibleName: string) {
    if (!this.records.includes(record) || !record.id || !visibleName.startsWith('E2E-TA-') || !['Opportunity', 'Quote'].includes(record.object)
      || ![record.name, ...(record.previousNames ?? [])].includes(visibleName)) throw new Error('Visible name is not an exact journaled name for this owned record.');
    record.name = visibleName; record.displayName = visibleName; this.persist();
  }
  markDeleted(record: UiRecord) { record.deleted = true; this.persist(); }
  async cleanup() {
    for (const object of ['Quote', 'Contract', 'Opportunity', 'Case', 'Pricebook2', 'Product2', 'Account'] as const) {
      for (const record of this.records.filter(record => !record.deleted && record.object === object).reverse()) await this.remove(record);
    }
  }
}
