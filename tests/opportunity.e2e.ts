import { expect } from 'e2e';
import { test } from '../support/core-fixtures.ts';
import { environment } from '../support/environment.ts';
import { futureDate, uniqueName } from '../support/data.ts';

test.describe('Salesforce Opportunity regression', { session: 'salesforce', tags: ['regression', 'opportunity'] }, () => {
  test('SF-OPP-001 | Create → Qualification → Proposal → Negotiation → Closed Won', { tags: ['smoke', 'lifecycle'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); let deal = await sales.opportunities.create(account, 'Lifecycle');
    for (const stage of [environment.stages.qualified, environment.stages.proposal, environment.stages.negotiation]) deal = await sales.opportunities.changeStage(deal, stage);
    deal = await sales.opportunities.changeStage(deal, environment.stages.won, environment.wonProbability);
    await sales.opportunities.assert(deal, environment.wonProbability);
  });
  for (const [id, field] of [['002', 'Opportunity Name'], ['003', 'Close Date'], ['004', 'Stage']] as const) {
    test(`SF-OPP-${id} | Required field: ${field}`, { tags: ['validation'] }, async ({ sales }) => {
      const account = await sales.accounts.create(); const prepared = await sales.opportunities.prepare(account, 'Required', {}, field);
      await sales.submit();
      await expect(sales.field(field)).toHaveAttribute('aria-invalid', 'true');
      await expect(sales.dialog()).toBeVisible(); await sales.cancel(); await sales.assertAbsent(prepared.record);
    });
  }
  test('SF-OPP-005 | Cancel creation', { tags: ['cancel'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const prepared = await sales.opportunities.prepare(account, 'Cancel');
    await sales.cancel(); await sales.assertAbsent(prepared.record);
  });
  test('SF-OPP-006 | Edit name, amount, date and Unicode description', { tags: ['smoke', 'edit'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const deal = await sales.opportunities.create(account, 'Edit');
    const updated = { ...deal, name: uniqueName('Renamed'), amount: 98765.43, closeDate: futureDate(60), description: 'Unicode áéíóöőúüű & symbols.' };
    await sales.form('Opportunity', {}, deal.record.id);
    await sales.fill('Opportunity Name', updated.name); await sales.fill('Amount', updated.amount);
    await sales.date('Close Date', updated.closeDate); await sales.fill('Description', updated.description);
    sales.owned.rename(deal.record, updated.name); await sales.save(); await sales.opportunities.assert(updated);
    // An asynchronously indexed old name can still return the renamed row.
    // Assert the exact old UI name is absent while persisted fields prove rename.
    await sales.assertNameAbsent('Opportunity', deal.name, updated.name);
  });
  test('SF-OPP-007 | Cancel editing', { tags: ['cancel', 'edit'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const deal = await sales.opportunities.create(account, 'CancelEdit');
    await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Opportunity Name', uniqueName('Unsaved')); await sales.fill('Amount', 1);
    await sales.cancel(); await sales.opportunities.assert(deal);
  });
  test('SF-OPP-008 | Closed Lost and automatic 0% probability', { tags: ['smoke', 'lifecycle'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const deal = await sales.opportunities.create(account, 'Lost');
    await sales.opportunities.changeStage(deal, environment.stages.lost, environment.lostProbability);
  });
  test('SF-OPP-009 | Reopen Closed Lost', { tags: ['lifecycle'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const deal = await sales.opportunities.create(account, 'Reopen');
    const lost = await sales.opportunities.changeStage(deal, environment.stages.lost, environment.lostProbability);
    const reopened = await sales.opportunities.changeStage(lost, environment.stages.qualified); const actual = await sales.opportunities.assert(reopened);
    expect(actual.Probability).toBeGreaterThan(environment.lostProbability); expect(actual.Probability).toBeLessThan(environment.wonProbability);
  });
  test('SF-OPP-010 | Cancel deletion', { tags: ['cancel', 'delete'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const deal = await sales.opportunities.create(account, 'CancelDelete');
    await sales.deleteDialog(deal.record); await sales.cancel(); await sales.opportunities.assert(deal);
  });
  test('SF-OPP-011 | Preserve Opportunity and its Quote after cancelled deletion', { tags: ['smoke', 'retention'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'RetainedDeal');
    const quote = await sales.quotes.create(deal);
    await sales.deleteDialog(deal.record); await sales.cancel(); await sales.opportunities.assert(deal);
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, OpportunityName: deal.name, Status: 'Draft' });
    await sales.quotes.assertOpportunityLink(deal);
  });
  for (const [id, amount] of [['012', 0], ['013', 0.01]] as const) {
    test(`SF-OPP-${id} | Persist amount: ${amount}`, { tags: ['amount'] }, async ({ sales }) => {
      const account = await sales.accounts.create(); const deal = await sales.opportunities.create(account, 'Amount', { amount }); await sales.opportunities.assert(deal);
    });
  }
  test('SF-OPP-014 | Persist a past Close Date on an open Opportunity', { tags: ['date', 'boundary'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'PastCloseDate', { closeDate: futureDate(-7) });
    await sales.opportunities.assert(deal);
  });
  test('SF-OPP-015 | Move an open Opportunity backwards through stages', { tags: ['lifecycle'] }, async ({ sales }) => {
    let deal = await sales.opportunities.create(await sales.accounts.create(), 'BackwardStages');
    for (const stage of [environment.stages.negotiation, environment.stages.proposal, environment.stages.qualified]) deal = await sales.opportunities.changeStage(deal, stage);
    const actual = await sales.opportunities.assert(deal);
    expect(actual.Probability).toBeGreaterThan(environment.lostProbability); expect(actual.Probability).toBeLessThan(environment.wonProbability);
  });
  test('SF-OPP-016 | Persist a seven-digit amount with cents', { tags: ['amount', 'boundary'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'LargeAmount', { amount: 1000000.99 });
    await sales.opportunities.assert(deal);
  });
  test('SF-OPP-017 | Edit a grouped decimal amount back to zero', { tags: ['amount', 'edit', 'boundary'] }, async ({ sales }) => {
    let deal = await sales.opportunities.create(await sales.accounts.create(), 'AmountRoundTrip');
    for (const amount of [1000000.99, 0]) {
      await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Amount', amount); await sales.save();
      deal = { ...deal, amount }; await sales.opportunities.assert(deal);
    }
  });
  for (const [id, description] of [['018', ''], ['019', 'First line: áéőű\nSecond line: delivery & support.']] as const) {
    test(`SF-OPP-${id} | Persist ${description ? 'multiline Unicode' : 'empty'} description`, { tags: ['edit', 'description'] }, async ({ sales }) => {
      let deal = await sales.opportunities.create(await sales.accounts.create(), 'Description');
      await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Description', description); await sales.save();
      deal = { ...deal, description }; await sales.opportunities.assert(deal);
    });
  }
  test('SF-OPP-020 | Edit Amount to a small decimal while preserving other fields', { tags: ['edit', 'amount'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'SmallAmountEdit');
    await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Amount', 42.42); await sales.save();
    await sales.opportunities.assert({ ...deal, amount: 42.42 });
  });
  for (const [id, days] of [['021', 0], ['022', 365]] as const) {
    test(`SF-OPP-${id} | Persist Close Date ${days === 0 ? 'today' : 'one year ahead'}`, { tags: ['date', 'boundary'] }, async ({ sales }) => {
      const deal = await sales.opportunities.create(await sales.accounts.create(), 'CloseDateBoundary', { closeDate: futureDate(days) });
      await sales.opportunities.assert(deal);
    });
  }
  test('SF-OPP-023 | Persist a manually entered probability', { tags: ['edit', 'probability'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'ManualProbability');
    await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Probability (%)', 37); await sales.save();
    await sales.opportunities.assert(deal, 37);
  });
  test('SF-OPP-024 | Persist Unicode Next Step', { tags: ['edit'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'NextStep'); const next = 'Árajánlat egyeztetés & follow-up';
    await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Next Step', next); await sales.save();
    expect((await sales.opportunities.assert(deal))['Next Step']).toBe(next);
  });
  test('SF-OPP-025 | Clear a previously saved Unicode Next Step', { tags: ['expansion-100', 'edit'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'ClearNextStep');
    for (const next of ['Árajánlat egyeztetés & follow-up', '']) {
      await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Next Step', next); await sales.save();
      expect((await sales.opportunities.assert(deal))['Next Step']).toBe(next);
    }
  });
  test('SF-OPP-026 | Cancel a manual probability change', { tags: ['expansion-100', 'cancel', 'probability'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'CancelProbability'); const original = await sales.opportunities.assert(deal);
    await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Probability (%)', 73); await sales.cancel();
    await sales.opportunities.assert(deal, Number(original.Probability));
  });
  for (const [id, probability] of [['027', 0], ['028', 100]] as const) {
    test(`SF-OPP-${id} | Persist ${probability}% probability on an open Opportunity`, { tags: ['expansion-100', 'probability', 'boundary'] }, async ({ sales }) => {
      const deal = await sales.opportunities.create(await sales.accounts.create(), 'ProbabilityBoundary');
      await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Probability (%)', probability); await sales.save();
      await sales.opportunities.assert(deal, probability);
    });
  }
  test('SF-OPP-029 | Cancel a Close Date change', { tags: ['expansion-100', 'cancel', 'date'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'CancelCloseDate');
    await sales.form('Opportunity', {}, deal.record.id); await sales.date('Close Date', futureDate(90)); await sales.cancel(); await sales.opportunities.assert(deal);
  });
  test('SF-OPP-030 | Edit an open Opportunity Close Date into the past', { tags: ['expansion-100', 'edit', 'date'] }, async ({ sales }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'EditPastCloseDate'); const closeDate = futureDate(-30);
    await sales.form('Opportunity', {}, deal.record.id); await sales.date('Close Date', closeDate); await sales.save(); await sales.opportunities.assert({ ...deal, closeDate });
  });
  for (const [id, field, value] of [['031', 'Order Number', 'ORD-ÁR01'], ['032', 'Main Competitor(s)', 'Versenytárs őű & partner'], ['033', 'Tracking Number', 'TRACK-100-A1']] as const) {
    test(`SF-OPP-${id} | Persist ${field}`, { tags: ['expansion-100', 'edit'] }, async ({ sales }) => {
      const deal = await sales.opportunities.create(await sales.accounts.create(), 'AdditionalField');
      await sales.form('Opportunity', {}, deal.record.id); await sales.fill(field, value); await sales.save();
      expect((await sales.opportunities.assert(deal))[field]).toBe(value);
    });
  }
  test('SF-OPP-034 | Isolate edits between two Opportunities sharing an Account', { tags: ['expansion-100', 'relationships'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const first = await sales.opportunities.create(account, 'FirstDeal'); const second = await sales.opportunities.create(account, 'SecondDeal');
    const updated = { ...first, amount: 456.78, closeDate: futureDate(75) };
    await sales.form('Opportunity', {}, first.record.id); await sales.fill('Amount', updated.amount); await sales.date('Close Date', updated.closeDate); await sales.save();
    expect(first.record.id).not.toBe(second.record.id); await sales.opportunities.assert(updated); await sales.opportunities.assert(second);
  });
});
