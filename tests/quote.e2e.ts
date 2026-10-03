import { expect } from 'e2e';
import { test } from '../support/core-fixtures.ts';
import { futureDate, uniqueName } from '../support/data.ts';

test.describe('Salesforce Quote regression', { session: 'salesforce', tags: ['regression', 'quote'] }, () => {
  test('SF-QUO-001 | Create Draft and persist Opportunity relationship and expiry', { tags: ['smoke'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteDeal'); await sales.quotes.create(deal);
  });
  test('SF-QUO-002 | Required Quote Name', { tags: ['validation'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteRequired');
    await sales.form('Quote', { OpportunityId: deal.record.id }); await sales.fill('Quote Name', '');
    await sales.submit();
    await sales.quotes.closeValidationError();
    await expect(sales.field('Quote Name')).toHaveAttribute('aria-invalid', 'true');
    await sales.cancel();
    await sales.quotes.assertEmptyRelatedList(deal);
  });
  test('SF-QUO-003 | Cancel creation', { tags: ['cancel'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteCancel'); const record = sales.owned.claim('Quote', uniqueName('CancelQuote'));
    await sales.form('Quote', { OpportunityId: deal.record.id }); await sales.fill('Quote Name', record.name);
    await sales.date('Expiration Date', futureDate(14)); await sales.cancel(); await sales.assertAbsent(record);
  });
  test('SF-QUO-004 | Edit name, expiry, description, tax and shipping', { tags: ['smoke', 'edit'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteEdit'); const quote = await sales.quotes.create(deal);
    const name = uniqueName('RenamedQuote'); const expires = futureDate(45);
    await sales.form('Quote', {}, quote.record.id); await sales.fill('Quote Name', name); await sales.date('Expiration Date', expires);
    await sales.fill('Description', 'Updated quote: áéőű & text.'); await sales.fill('Tax', 12.34); await sales.fill('Shipping and Handling', 5.67);
    sales.owned.rename(quote.record, name); await sales.save();
    expect(await sales.read(quote.record))
      .toMatchObject({ Name: name, OpportunityName: deal.name, ExpirationDate: expires, Description: 'Updated quote: áéőű & text.', Tax: 12.34, ShippingHandling: 5.67, GrandTotal: 18.01 });
  });
  test('SF-QUO-005 | Cancel editing', { tags: ['cancel'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteCancelEdit'); const quote = await sales.quotes.create(deal);
    await sales.form('Quote', {}, quote.record.id); await sales.fill('Quote Name', uniqueName('UnsavedQuote')); await sales.choose('Status', 'Accepted'); await sales.cancel();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: 'Draft' });
  });
  test('SF-QUO-006 | Quote statuses: Presented → Accepted', { tags: ['lifecycle'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteStatus'); const quote = await sales.quotes.create(deal);
    for (const status of ['Presented', 'Accepted']) {
      await sales.form('Quote', {}, quote.record.id); await sales.choose('Status', status); await sales.save();
      expect((await sales.read(quote.record)).Status).toBe(status);
    }
  });
  test('SF-QUO-007 | Cancel deletion', { tags: ['cancel', 'delete'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteCancelDelete'); const quote = await sales.quotes.create(deal);
    await sales.deleteDialog(quote.record); await sales.cancel();
    expect((await sales.read(quote.record)).Name).toBe(quote.record.name);
  });
  test('SF-QUO-008 | Confirm UI deletion', { tags: ['delete'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'QuoteDelete'); const quote = await sales.quotes.create(deal); await sales.delete(quote.record);
  });
  test('SF-QUO-009 | Product line, price totals and Opportunity synchronization', { tags: ['smoke', 'products', 'lifecycle'] }, async ({ sales }) => {
    const catalog = await sales.catalog.create();
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'QuoteSync'));
    const total = await sales.quotes.lines.add(quote.record, catalog, 2);
    await sales.quotes.sync(quote.record, true);
    await sales.opportunities.assert({ ...quote.deal, amount: total });
    await sales.quotes.sync(quote.record, false);
    expect(await sales.read(quote.record)).toMatchObject({ Subtotal: total, TotalPrice: total, GrandTotal: total });
    await sales.opportunities.assert({ ...quote.deal, amount: total });
  });
  test('SF-QUO-010 | Deny a Quote without changing its Opportunity', { tags: ['lifecycle'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'DeniedQuote'); const quote = await sales.quotes.create(deal);
    await sales.form('Quote', {}, quote.record.id); await sales.choose('Status', 'Denied'); await sales.save();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: 'Denied', OpportunityName: deal.name });
    await sales.quotes.assertOpportunityLink(deal); await sales.opportunities.assert(deal);
  });
  test('SF-QUO-011 | Persist a past Quote expiration date', { tags: ['date', 'boundary'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'ExpiredQuote'); const quote = await sales.quotes.create(deal); const expires = futureDate(-1);
    await sales.form('Quote', {}, quote.record.id); await sales.date('Expiration Date', expires); await sales.save();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: 'Draft', ExpirationDate: expires, OpportunityName: deal.name });
    await sales.quotes.assertOpportunityLink(deal);
  });
  test('SF-QUO-012 | Reset tax and shipping to zero and recalculate total', { tags: ['amount', 'edit', 'boundary'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'QuoteZeroCosts'));
    for (const [tax, shipping, total] of [[12.34, 5.67, 18.01], [0, 0, 0]]) {
      await sales.form('Quote', {}, quote.record.id); await sales.fill('Tax', tax); await sales.fill('Shipping and Handling', shipping); await sales.save();
      expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Tax: tax, ShippingHandling: shipping, GrandTotal: total, Status: 'Draft' });
    }
  });
  test('SF-QUO-013 | Keep two Quotes isolated under the same Opportunity', { tags: ['lifecycle', 'relationships'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'AlternativeQuotes');
    const first = await sales.quotes.create(deal, 'PrimaryQuote'); const second = await sales.quotes.create(deal, 'AlternativeQuote');
    await sales.form('Quote', {}, first.record.id); await sales.choose('Status', 'Denied'); await sales.save();
    expect(await sales.read(first.record)).toMatchObject({ Name: first.record.name, Status: 'Denied', OpportunityName: deal.name }); await sales.quotes.assertOpportunityLink(deal);
    expect(await sales.read(second.record)).toMatchObject({ Name: second.record.name, Status: 'Draft', OpportunityName: deal.name }); await sales.quotes.assertOpportunityLink(deal);
    await sales.form('Quote', {}, second.record.id); await sales.choose('Status', 'Presented'); await sales.save();
    expect(await sales.read(second.record)).toMatchObject({ Name: second.record.name, Status: 'Presented', OpportunityName: deal.name });
    expect(await sales.read(first.record)).toMatchObject({ Name: first.record.name, Status: 'Denied', OpportunityName: deal.name }); await sales.opportunities.assert(deal);
  });
});
