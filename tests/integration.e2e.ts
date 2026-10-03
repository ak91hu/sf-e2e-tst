import { expect } from 'e2e';
import { test } from '../support/core-fixtures.ts';
import { environment } from '../support/environment.ts';
import { uniqueName } from '../support/data.ts';
import { resetUiBridge } from '../support/oauth.ts';
import { switchSalesforcePersona } from '../support/ui-login.ts';

test('SF-E2E-001 | Opportunity → Accepted Quote → Closed Won → Activated Contract → Service handoff', {
  session: 'salesforce', tags: ['regression', 'integration', 'smoke'],
}, async ({ sales, app, screen, browser, salesforceAuth }) => {
  const account = await sales.accounts.create(); let deal = await sales.opportunities.create(account, 'SalesToService');
  deal = await sales.opportunities.changeStage(deal, environment.stages.negotiation);
  const quote = await sales.quotes.create(deal);
  await sales.form('Quote', {}, quote.record.id); await sales.choose('Status', 'Accepted'); await sales.save();
  expect(await sales.read(quote.record)).toMatchObject({ Status: 'Accepted', OpportunityName: deal.name, AccountName: account.name });
  await sales.quotes.assertOpportunityLink(deal);
  deal = await sales.opportunities.changeStage(deal, environment.stages.won, 100);
  const contract = await sales.contracts.create(account); const activated = await sales.contracts.activate(contract.record);
  expect(activated).toMatchObject({ AccountName: account.name, Status: 'Activated', ContractTerm: 12 });
  // Standard Contract relates to the Account; this org has no Opportunity.ContractId.
  // Hand the same persisted contract to the Service persona through a UI login.
  try {
    resetUiBridge(); await switchSalesforcePersona(app, screen, browser, 'service', salesforceAuth);
    expect(await sales.read(contract.record)).toMatchObject({ AccountName: account.name, Status: 'Activated', Description: contract.record.marker });
    await sales.contracts.assertReadOnly();
  } finally { resetUiBridge(); await switchSalesforcePersona(app, screen, browser, 'sales', salesforceAuth); }
  await sales.opportunities.assert(deal, 100);
});

test('SF-E2E-002 | Complete product sale from Account to synced Quote, Won Opportunity and Service Contract', {
  session: 'salesforce', tags: ['regression', 'integration', 'monolithic', 'products'],
}, async ({ sales, app, screen, browser, salesforceAuth }) => {
  const catalog = await sales.catalog.create();
  const account = await sales.accounts.create(); let deal = await sales.opportunities.create(account, 'CompleteProductSale');
  for (const stage of [environment.stages.qualified, environment.stages.proposal]) deal = await sales.opportunities.changeStage(deal, stage);
  const quote = await sales.quotes.create(deal, 'CompleteSaleQuote'); const total = await sales.quotes.lines.add(quote.record, catalog, 2);
  expect(total).toBe(251);
  for (const status of ['Presented', 'Accepted']) {
    await sales.form('Quote', {}, quote.record.id); await sales.choose('Status', status); await sales.save();
    expect(await sales.read(quote.record)).toMatchObject({ Name: quote.record.name, Status: status, AccountName: account.name, OpportunityName: deal.name, Subtotal: total, TotalPrice: total, GrandTotal: total });
    await sales.quotes.assertOpportunityLink(deal);
  }
  await sales.quotes.sync(quote.record, true); deal = { ...deal, amount: total }; await sales.opportunities.assert(deal);
  await sales.quotes.sync(quote.record, false); await sales.opportunities.assert(deal);
  deal = await sales.opportunities.changeStage(deal, environment.stages.negotiation);
  deal = await sales.opportunities.changeStage(deal, environment.stages.won, environment.wonProbability);
  const contract = await sales.contracts.create(account, 24); const terms = 'Agreed delivery in 30 days; service SLA 8 hours.';
  await sales.form('Contract', {}, contract.record.id); await sales.fill('Special Terms', terms); await sales.save();
  expect(await sales.contracts.activate(contract.record)).toMatchObject({ AccountName: account.name, Status: 'Activated', ContractTerm: 24, SpecialTerms: terms });
  try {
    resetUiBridge(); await switchSalesforcePersona(app, screen, browser, 'service', salesforceAuth);
    expect(await sales.read(contract.record)).toMatchObject({ AccountName: account.name, Status: 'Activated', ContractTerm: 24, SpecialTerms: terms, Description: contract.record.marker });
    await sales.contracts.assertReadOnly();
  } finally { resetUiBridge(); await switchSalesforcePersona(app, screen, browser, 'sales', salesforceAuth); }
  await sales.opportunities.assert(deal, environment.wonProbability);
  expect(await sales.read(quote.record)).toMatchObject({ Status: 'Accepted', Syncing: false, GrandTotal: total, OpportunityName: deal.name });
  expect(await sales.read(contract.record)).toMatchObject({ Status: 'Activated', AccountName: account.name, ContractTerm: 24, SpecialTerms: terms });
});

test('SF-E2E-003 | Recover a lost sale, replace a denied Quote and activate the revised Service Contract', {
  session: 'salesforce', tags: ['regression', 'integration', 'monolithic', 'lifecycle'],
}, async ({ sales, app, screen, browser, salesforceAuth }) => {
  const account = await sales.accounts.create(); let deal = await sales.opportunities.create(account, 'RecoveredSale');
  deal = await sales.opportunities.changeStage(deal, environment.stages.lost, environment.lostProbability);
  for (const stage of [environment.stages.qualified, environment.stages.proposal, environment.stages.negotiation]) deal = await sales.opportunities.changeStage(deal, stage);
  const denied = await sales.quotes.create(deal, 'DeniedProposal');
  await sales.form('Quote', {}, denied.record.id); await sales.choose('Status', 'Denied'); await sales.save();
  expect(await sales.read(denied.record)).toMatchObject({ Name: denied.record.name, Status: 'Denied', OpportunityName: deal.name });
  const accepted = await sales.quotes.create(deal, 'RevisedProposal');
  await sales.form('Quote', {}, accepted.record.id); await sales.fill('Tax', 12.34); await sales.fill('Shipping and Handling', 5.67); await sales.choose('Status', 'Presented'); await sales.save();
  expect(await sales.read(accepted.record)).toMatchObject({ Name: accepted.record.name, Status: 'Presented', Tax: 12.34, ShippingHandling: 5.67, GrandTotal: 18.01 });
  await sales.form('Quote', {}, accepted.record.id); await sales.choose('Status', 'Accepted'); await sales.save();
  expect(await sales.read(accepted.record)).toMatchObject({ Name: accepted.record.name, Status: 'Accepted', AccountName: account.name, OpportunityName: deal.name, GrandTotal: 18.01 }); await sales.quotes.assertOpportunityLink(deal);
  expect(await sales.read(denied.record)).toMatchObject({ Name: denied.record.name, Status: 'Denied', OpportunityName: deal.name });
  await sales.form('Opportunity', {}, deal.record.id); await sales.fill('Amount', 18.01); await sales.save(); deal = { ...deal, amount: 18.01 }; await sales.opportunities.assert(deal);
  deal = await sales.opportunities.changeStage(deal, environment.stages.won, environment.wonProbability);
  const contract = await sales.contracts.create(account); const terms = uniqueName('RevisedServiceTerms');
  await sales.form('Contract', {}, contract.record.id); await sales.fill('Contract Term (months)', 24); await sales.fill('Special Terms', terms); await sales.save();
  expect(await sales.read(contract.record)).toMatchObject({ ContractTerm: 24, SpecialTerms: terms, Status: 'Draft', AccountName: account.name });
  expect(await sales.contracts.activate(contract.record)).toMatchObject({ ContractTerm: 24, Status: 'Activated', AccountName: account.name, SpecialTerms: terms });
  try {
    resetUiBridge(); await switchSalesforcePersona(app, screen, browser, 'service', salesforceAuth);
    expect(await sales.read(contract.record)).toMatchObject({ Status: 'Activated', ContractTerm: 24, AccountName: account.name, SpecialTerms: terms, Description: contract.record.marker });
    await sales.contracts.assertReadOnly();
  } finally { resetUiBridge(); await switchSalesforcePersona(app, screen, browser, 'sales', salesforceAuth); }
  await sales.opportunities.assert(deal, environment.wonProbability);
  expect(await sales.read(accepted.record)).toMatchObject({ Status: 'Accepted', GrandTotal: 18.01, OpportunityName: deal.name });
  expect(await sales.read(denied.record)).toMatchObject({ Status: 'Denied', OpportunityName: deal.name });
});
