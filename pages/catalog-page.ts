import { expect } from 'e2e';
import { uniqueName } from '../support/data.ts';
import type { SalesUi, SavedRecord } from '../support/sales-ui.ts';

export interface Catalog { product: SavedRecord; book: SavedRecord; unitPrice: number }
export class CatalogPage {
  constructor(private readonly sales: SalesUi) {}
  async create(unitPrice = 125.50): Promise<Catalog> {
  const sales = this.sales;
  const record = sales.owned.claim('Product2', uniqueName('Product'));
  await sales.form('Product2'); await sales.fill('Product Name', record.name); await sales.fill('Product Code', record.name);
  await sales.field('Active').check(); await sales.save(); const product = await sales.resolve(record);
  await sales.open(product); await sales.screen.getByRole('tab', 'Related', { visible: true }).tap();
  await sales.screen.getByRole('button', 'Add Standard Price', { visible: true }).tap();
  await expect(sales.dialog().getByRole('button', 'Save')).toBeVisible(); await sales.fill('List Price', unitPrice);
  await sales.save();
  const bookRecord = sales.owned.claim('Pricebook2', uniqueName('Pricebook'));
  await sales.form('Pricebook2', { IsActive: true }); await sales.fill('Price Book Name', bookRecord.name); await expect(sales.field('Active')).toBeChecked(); await sales.save(); const book = await sales.resolve(bookRecord);
  await sales.open(book); await sales.screen.getByRole('tab', 'Related', { visible: true }).tap();
  await sales.screen.getByRole('button', 'Add Products', { visible: true }).tap();
  const picker = sales.screen.getByRole('dialog', { visible: true });
  // Fresh products are rendered in the picker before the asynchronous search
  // index includes them. Select the exact visible row without indexed search.
  const row = picker.getByRole('grid').getByRole('row', new RegExp(product.name), { visible: true }); await expect(row).toBeVisible();
  await row.getByRole('gridcell', /^Select item /).tap(); await expect(row.getByRole('checkbox')).toBeChecked();
  await expect(picker.getByRole('button', 'Next')).toBeEnabled();
  await picker.getByRole('button', 'Next').tap(); await expect(picker.getByRole('button', 'Save')).toBeVisible();
  await expect(picker.getByText(product.name, { exact: true, visible: true }).first()).toBeVisible();
  await picker.getByRole('button', 'Save').tap(); await expect(picker).not.toBeVisible();
  await sales.open(book); await sales.screen.getByRole('tab', 'Related', { visible: true }).tap();
  await expect(sales.screen.getByRole('heading', 'Price Book Entries (1)', { visible: true })).toBeVisible();
  await expect(sales.screen.getByRole('row', new RegExp(product.name), { visible: true })).toContainText(`$${unitPrice.toFixed(2)}`);
  return { product, book, unitPrice };
}

}
