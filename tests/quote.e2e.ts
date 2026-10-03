import { expect } from 'e2e';
import { test } from '../support/core-fixtures.ts';
import { futureDate, uniqueName } from '../support/data.ts';

test.describe('Salesforce Quote regresszió', { session: 'salesforce', tags: ['regression', 'quote'] }, () => {
  test('SF-QUO-001 | Draft ajánlat, Opportunity-kapcsolat és lejárat mentése', { tags: ['smoke'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteDeal'); await sales.quotes.create(deal);
  });
  test('SF-QUO-002 | Kötelező Quote Name', { tags: ['validation'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteRequired');
    await sales.form('Quote', { OpportunityId: deal.record.id }); await sales.fill('Quote Name', '');
    await sales.submit();
    await sales.quotes.closeValidationError();
    await expect(sales.field('Quote Name')).toHaveAttribute('aria-invalid', 'true');
    await sales.cancel();
    await sales.quotes.assertEmptyRelatedList(deal);
  });
  test('SF-QUO-003 | Létrehozás elvetése', { tags: ['cancel'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteCancel'); const record = sales.owned.claim('Quote', uniqueName('CancelQuote'));
    await sales.form('Quote', { OpportunityId: deal.record.id }); await sales.fill('Quote Name', record.name);
    await sales.date('Expiration Date', futureDate(14)); await sales.cancel(); await sales.assertAbsent(record);
  });
  test('SF-QUO-004 | Név, lejárat, leírás, adó és szállítás szerkesztése', { tags: ['smoke', 'edit'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteEdit'); const quote = await sales.quotes.create(deal);
    const name = uniqueName('RenamedQuote'); const expires = futureDate(45);
    await sales.form('Quote', {}, quote.record.id); await sales.fill('Quote Name', name); await sales.date('Expiration Date', expires);
    await sales.fill('Description', 'Módosított ajánlat: áéőű & text.'); await sales.fill('Tax', 12.34); await sales.fill('Shipping and Handling', 5.67);
    sales.owned.rename(quote.record, name); await sales.save();
    expect(await sales.read(quote.record))
      .toMatchObject({ Name: name, OpportunityName: deal.name, ExpirationDate: expires, Description: 'Módosított ajánlat: áéőű & text.', Tax: 12.34, ShippingHandling: 5.67, GrandTotal: 18.01 });
  });
  test('SF-QUO-005 | Szerkesztés elvetése', { tags: ['cancel'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteCancelEdit'); const quote = await sales.quotes.create(deal);
    await sales.form('Quote', {}, quote.record.id); await sales.fill('Quote Name', uniqueName('UnsavedQuote')); await sales.choose('Status', 'Accepted'); await sales.cancel();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: 'Draft' });
  });
  test('SF-QUO-006 | Ajánlat státuszai: Presented → Accepted', { tags: ['lifecycle'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteStatus'); const quote = await sales.quotes.create(deal);
    for (const status of ['Presented', 'Accepted']) {
      await sales.form('Quote', {}, quote.record.id); await sales.choose('Status', status); await sales.save();
      expect((await sales.read(quote.record)).Status).toBe(status);
    }
  });
  test('SF-QUO-007 | Törlés elvetése', { tags: ['cancel', 'delete'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteCancelDelete'); const quote = await sales.quotes.create(deal);
    await sales.deleteDialog(quote.record); await sales.cancel();
    expect((await sales.read(quote.record)).Name).toBe(quote.record.name);
  });
  test('SF-QUO-008 | Megerősített UI-törlés', { tags: ['delete'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteDelete'); const quote = await sales.quotes.create(deal); await sales.delete(quote.record);
  });
  test('SF-QUO-009 | Terméktétel, árösszesítés és Opportunity-szinkronizálás', { tags: ['smoke', 'products', 'lifecycle'] }, async ({ sales }) => {
    const catalog = await sales.catalog.create();
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'QuoteSync'));
    const total = await sales.quotes.lines.add(quote.record, catalog, 2);
    await sales.quotes.sync(quote.record, true);
    await sales.opportunities.assert({ ...quote.deal, amount: total });
    await sales.quotes.sync(quote.record, false);
    expect(await sales.read(quote.record)).toMatchObject({ Subtotal: total, TotalPrice: total, GrandTotal: total });
    await sales.opportunities.assert({ ...quote.deal, amount: total });
  });
});
