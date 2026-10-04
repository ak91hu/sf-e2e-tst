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
  test('SF-QUO-008 | Preserve Quote and Opportunity across repeated navigation', { tags: ['retention'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'RetainedQuote'); const quote = await sales.quotes.create(deal);
    await sales.opportunities.assert(deal);
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, OpportunityName: deal.name, Status: 'Draft' });
    await sales.quotes.assertOpportunityLink(deal);
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
  for (const [id, tax, shipping] of [['014', 12.34, 0], ['015', 0, 5.67], ['016', 1000000.99, 12345.67], ['017', 0.01, 0.01]] as const) {
    test(`SF-QUO-${id} | Recalculate total with tax ${tax} and shipping ${shipping}`, { tags: ['edit', 'amount', 'boundary'] }, async ({ sales }) => {
      const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'Charges'));
      await sales.form('Quote', {}, quote.record.id); await sales.fill('Tax', tax); await sales.fill('Shipping and Handling', shipping); await sales.save();
      expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: 'Draft', Tax: tax, ShippingHandling: shipping, Subtotal: 0, TotalPrice: 0, GrandTotal: Math.round((tax + shipping) * 100) / 100 });
      await sales.quotes.assertOpportunityLink(quote.deal); await sales.opportunities.assert(quote.deal);
    });
  }
  test('SF-QUO-018 | Persist Quote expiration today', { tags: ['date', 'boundary'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'ExpiresToday')); const expires = futureDate(0);
    await sales.form('Quote', {}, quote.record.id); await sales.date('Expiration Date', expires); await sales.save();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, ExpirationDate: expires, Status: 'Draft', OpportunityName: quote.deal.name });
    await sales.quotes.assertOpportunityLink(quote.deal);
  });
  for (const [id, description] of [['019', ''], ['020', 'Quote first line: áéőű\nSecond line: service & delivery.']] as const) {
    test(`SF-QUO-${id} | Persist ${description ? 'multiline Unicode' : 'empty'} description`, { tags: ['edit', 'description'] }, async ({ sales }) => {
      const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'QuoteDescription'));
      await sales.form('Quote', {}, quote.record.id); await sales.fill('Description', description); await sales.save();
      expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Description: description, Status: 'Draft', OpportunityName: quote.deal.name });
      await sales.quotes.assertOpportunityLink(quote.deal);
    });
  }
  test('SF-QUO-021 | Return an Accepted Quote to Draft', { tags: ['lifecycle'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'QuoteReopen'));
    for (const status of ['Accepted', 'Draft']) {
      await sales.form('Quote', {}, quote.record.id); await sales.choose('Status', status); await sales.save();
      expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: status, OpportunityName: quote.deal.name });
      await sales.quotes.assertOpportunityLink(quote.deal);
    }
    await sales.opportunities.assert(quote.deal);
  });
  test('SF-QUO-022 | Persist Quote expiration one year ahead', { tags: ['expansion-100', 'date', 'boundary'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'ExpiresNextYear')); const expires = futureDate(365);
    await sales.form('Quote', {}, quote.record.id); await sales.date('Expiration Date', expires); await sales.save();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, ExpirationDate: expires, Status: 'Draft', OpportunityName: quote.deal.name, AccountName: quote.deal.account.name });
    await sales.quotes.assertOpportunityLink(quote.deal);
  });
  test('SF-QUO-023 | Cancel Quote expiration editing', { tags: ['expansion-100', 'cancel', 'date'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'CancelExpiry'));
    await sales.form('Quote', {}, quote.record.id); await sales.date('Expiration Date', futureDate(90)); await sales.cancel();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, ExpirationDate: quote.expires, Status: 'Draft', OpportunityName: quote.deal.name });
    await sales.quotes.assertOpportunityLink(quote.deal);
  });
  test('SF-QUO-024 | Cancel Quote tax and shipping editing', { tags: ['expansion-100', 'cancel', 'amount'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'CancelCharges'));
    await sales.form('Quote', {}, quote.record.id); await sales.fill('Tax', 1.23); await sales.fill('Shipping and Handling', 4.56); await sales.save();
    const original = await sales.read(quote.record); expect(original).toMatchObject({ Tax: 1.23, ShippingHandling: 4.56, GrandTotal: 5.79 });
    await sales.form('Quote', {}, quote.record.id); await sales.fill('Tax', 12.34); await sales.fill('Shipping and Handling', 5.67); await sales.cancel();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Tax: original.Tax, ShippingHandling: original.ShippingHandling, GrandTotal: original.GrandTotal, Status: 'Draft', OpportunityName: quote.deal.name });
    await sales.quotes.assertOpportunityLink(quote.deal);
  });
  for (const [id, statuses] of [['025', ['Presented', 'Denied']], ['026', ['Denied', 'Draft']]] as const) {
    test(`SF-QUO-${id} | Quote ${statuses.join(' → ')} without changing its Opportunity`, { tags: ['expansion-100', 'lifecycle'] }, async ({ sales }) => {
      const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'QuoteStatusRoundTrip'));
      for (const status of statuses) {
        await sales.form('Quote', {}, quote.record.id); await sales.choose('Status', status); await sales.save();
        expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: status, OpportunityName: quote.deal.name });
        await sales.quotes.assertOpportunityLink(quote.deal); await sales.opportunities.assert(quote.deal);
      }
    });
  }
  test('SF-QUO-027 | Rename the same Quote twice', { tags: ['expansion-100', 'edit'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'QuoteRenameTwice'));
    for (const name of [uniqueName('QuoteRevisionOne'), uniqueName('QuoteRevisionTwo')]) {
      const previous = quote.record.name;
      await sales.form('Quote', {}, quote.record.id); await sales.fill('Quote Name', name); sales.owned.rename(quote.record, name); await sales.save();
      expect(await sales.read(quote.record)).toMatchObject({ Name: name, Status: 'Draft', OpportunityName: quote.deal.name });
      await sales.quotes.assertOpportunityLink(quote.deal); await sales.assertNameAbsent('Quote', previous, name);
    }
    await sales.opportunities.assert(quote.deal);
  });
  for (const [id, changed, tax, shipping, total] of [['028', 'Tax', 56.78, 5.67, 62.45], ['029', 'Shipping and Handling', 12.34, 9.99, 22.33]] as const) {
    test(`SF-QUO-${id} | Edit ${changed} while preserving the other charge`, { tags: ['expansion-100', 'edit', 'amount'] }, async ({ sales }) => {
      const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'IndependentCharges'));
      await sales.form('Quote', {}, quote.record.id); await sales.fill('Tax', 12.34); await sales.fill('Shipping and Handling', 5.67); await sales.save();
      expect(await sales.read(quote.record)).toMatchObject({ Tax: 12.34, ShippingHandling: 5.67, GrandTotal: 18.01 });
      await sales.form('Quote', {}, quote.record.id); await sales.fill(changed, changed === 'Tax' ? tax : shipping); await sales.save();
      expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: 'Draft', Tax: tax, ShippingHandling: shipping, GrandTotal: total, Subtotal: 0, TotalPrice: 0, OpportunityName: quote.deal.name });
      await sales.quotes.assertOpportunityLink(quote.deal); await sales.opportunities.assert(quote.deal);
    });
  }
  test('SF-QUO-030 | Cancel Quote Description editing', { tags: ['expansion-100', 'cancel', 'description'] }, async ({ sales }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'CancelQuoteDescription')); const original = await sales.read(quote.record);
    await sales.form('Quote', {}, quote.record.id); await sales.fill('Description', 'Unsaved őű & description.\nSecond line.'); await sales.cancel();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Description: original.Description, Status: 'Draft', OpportunityName: quote.deal.name });
    await sales.quotes.assertOpportunityLink(quote.deal);
  });
  test('SF-QUO-031 | Isolate Quotes belonging to different Opportunities', { tags: ['expansion-100', 'relationships', 'amount'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const firstDeal = await sales.opportunities.create(account, 'FirstQuoteParent'); const secondDeal = await sales.opportunities.create(account, 'SecondQuoteParent');
    const first = await sales.quotes.create(firstDeal); const second = await sales.quotes.create(secondDeal); const originalSecond = await sales.read(second.record);
    await sales.form('Quote', {}, first.record.id); await sales.choose('Status', 'Accepted'); await sales.fill('Tax', 12.34); await sales.fill('Shipping and Handling', 5.67); await sales.save();
    expect(first.record.id).not.toBe(second.record.id); expect(firstDeal.record.id).not.toBe(secondDeal.record.id);
    expect(await sales.read(first.record)).toMatchObject({ Name: first.record.name, Status: 'Accepted', Tax: 12.34, ShippingHandling: 5.67, GrandTotal: 18.01, OpportunityName: firstDeal.name }); await sales.quotes.assertOpportunityLink(firstDeal);
    expect(await sales.read(second.record)).toMatchObject({ Name: second.record.name, Status: 'Draft', Tax: originalSecond.Tax, 'Shipping and Handling': originalSecond['Shipping and Handling'], GrandTotal: 0, OpportunityName: secondDeal.name }); await sales.quotes.assertOpportunityLink(secondDeal);
    await sales.opportunities.assert(firstDeal); await sales.opportunities.assert(secondDeal);
  });
});
