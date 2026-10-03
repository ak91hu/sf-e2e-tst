import { expect } from 'e2e';
import type { SalesUi, SavedRecord } from '../../support/sales-ui.ts';
import type { Catalog } from '../catalog-page.ts';

export class QuoteLineItems {
  constructor(private readonly sales: SalesUi) {}
  async add(quote: SavedRecord, catalog: Catalog, quantity = 2) {
  const sales = this.sales;
  await sales.open(quote); await sales.screen.getByRole('tab', 'Related', { visible: true }).tap();
  await sales.screen.getByRole('button', 'Add Products', { visible: true }).tap();
  const picker = sales.screen.getByRole('dialog', { visible: true });
  await expect(picker.getByRole('button', 'Save', { visible: true })).toBeVisible();
  const book = picker.getByRole('combobox', 'Price Book', { visible: true });
  // Salesforce asynchronously selects the price book just visited during
  // catalog setup. Wait for the lookup value; the initial control is loading.
  await expect(book).toHaveValue(catalog.book.name);
  await picker.getByRole('button', 'Save').tap();
  await expect(picker.getByRole('heading', 'Add Products', { visible: true })).toBeVisible();
  const row = picker.getByRole('grid').getByRole('row', new RegExp(catalog.product.name), { visible: true }); await expect(row).toBeVisible();
  await row.getByRole('gridcell', /^Select item /).tap(); await expect(row.getByRole('checkbox')).toBeChecked();
  await picker.getByRole('button', 'Next').tap();
  await expect(picker.getByRole('heading', 'Edit Selected Quote Line Items', { visible: true })).toBeVisible();
  await expect(picker.getByText(catalog.product.name, { exact: true, visible: true }).first()).toBeVisible();
  await picker.getByRole('button', /^Edit Quantity: Item /, { visible: true }).tap();
  const input = picker.getByRole('textbox', { visible: true }); await expect(input).toHaveCount(1); await input.fill(String(quantity)); await input.press('Tab');
  await expect(picker.getByRole('gridcell').filter({ has: sales.screen.getByRole('button', /^Edit Quantity: Item /) })).toContainText(quantity.toFixed(2));
  await picker.getByRole('button', 'Save', { visible: true }).tap(); await expect(picker).not.toBeVisible();
  const total = Math.round(catalog.unitPrice * quantity * 100) / 100;
  expect(await sales.read(quote)).toMatchObject({ Subtotal: total, TotalPrice: total, GrandTotal: total });
  await sales.screen.getByRole('tab', 'Related', { visible: true }).tap();
  await expect(sales.screen.getByRole('heading', 'Quote Line Items (1)', { visible: true })).toBeVisible();
  await expect(sales.screen.getByRole('link', catalog.product.name, { exact: true, visible: true })).toBeVisible();
  return total;
}

}
