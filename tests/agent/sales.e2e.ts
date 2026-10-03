import { expect, unique } from 'e2e';
import { z } from 'zod';
import { test } from '../../support/core-fixtures.ts';
import { uniqueName } from '../../support/data.ts';

test.describe('AI által végrehajtott Salesforce UI-regresszió', { session: 'salesforce', tags: ['ai'] }, () => {
  test('SF-AI-001 | Opportunity szerkesztése természetes nyelvű céllal', async ({ sales, agent }) => {
    const deal = await sales.opportunities.create(await sales.accounts.create(), 'AgentDeal');
    const updated = { ...deal, name: uniqueName('AgentRenamed'), amount: 543.21 };
    await sales.form('Opportunity', {}, deal.record.id);
    sales.owned.rename(deal.record, updated.name);
    await agent.act('In the current Opportunity edit dialog, set Opportunity Name to {name}, set Amount to {amount}, then click Save. Leave all other fields unchanged.', { params: { name: unique(updated.name), amount: updated.amount } });
    await expect(sales.dialog()).not.toBeVisible(); await sales.opportunities.assert(updated);
  });
  test('SF-AI-002 | Contract feltételeinek szerkesztése és UI-ellenőrzés', async ({ sales, agent }) => {
    const contract = await sales.contracts.create(await sales.accounts.create()); const terms = uniqueName('AgentTerms');
    await sales.form('Contract', {}, contract.record.id);
    await agent.act('In the current Contract edit dialog, set Contract Term (months) to 24, set Special Terms to {terms}, and click Save.', { params: { terms: unique(terms) } });
    await expect(sales.dialog()).not.toBeVisible(); expect(await sales.read(contract.record)).toMatchObject({ ContractTerm: 24, SpecialTerms: terms, Status: 'Draft' });
    await agent.assert('The visible Contract Details show Draft status and a contract term of 24 months.');
  });
  test('SF-AI-003 | Quote elfogadása és strukturált UI-kiolvasás', async ({ sales, agent }) => {
    const quote = await sales.quotes.create(await sales.opportunities.create(await sales.accounts.create(), 'AgentQuoteDeal'));
    await sales.form('Quote', {}, quote.record.id);
    await agent.act('In the current Quote edit dialog, set Status to Accepted and click Save. Leave other fields unchanged.');
    await expect(sales.dialog()).not.toBeVisible(); expect((await sales.read(quote.record)).Status).toBe('Accepted');
    const snapshot = await agent.extract('Read the Quote Name, Status, and associated Opportunity Name from the currently visible Details. Return exact visible names.', { schema: z.object({ name: z.string(), status: z.string(), opportunity: z.string() }) });
    expect(snapshot).toEqual({ name: quote.record.name, status: 'Accepted', opportunity: quote.deal.name });
  });
});
