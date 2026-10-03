import { expect } from 'e2e';
import { test } from '../support/core-fixtures.ts';
import { environment } from '../support/environment.ts';
import { resetUiBridge } from '../support/oauth.ts';
import { switchSalesforcePersona } from '../support/ui-login.ts';

test('SF-E2E-001 | Opportunity → Accepted Quote → Closed Won → Activated Contract → Service átadás', {
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
