import { test } from '../support/auth-engine.ts';
import { readJwtConfig, resetUiBridge } from '../support/oauth.ts';
import { openSalesforceSession, verifySalesforcePersona } from '../support/ui-login.ts';
import { environment } from '../support/environment.ts';

test.setup('SF-AUTH | Salesforce JWT → Lightning session', {
  sessions: ['salesforce'], timeout: 150_000,
}, async ({ app, screen, browser, session, salesforceAuth }) => {
  readJwtConfig();
  if (environment.username === process.env.SF_USERNAME) throw new Error('Administrator identity is forbidden for business regression. Configure SF_SALES_USERNAME.');
  resetUiBridge();
  try {
    await openSalesforceSession(app, screen, browser, 'sales', salesforceAuth);
    await app.screenshot('sales-authenticated-opportunity-list');
    await verifySalesforcePersona(screen, 'sales', app);
    await app.screenshot('sales-authentication-success');
    await session.save('salesforce');
  } finally { resetUiBridge(); }
});

test.setup('SF-AUTH-SERVICE | Service Manager JWT → Lightning session', {
  sessions: ['service'], timeout: 150_000,
}, async ({ app, screen, browser, session, salesforceAuth }) => {
  resetUiBridge();
  try { await openSalesforceSession(app, screen, browser, 'service', salesforceAuth); await app.screenshot('service-authenticated-opportunity-list'); await verifySalesforcePersona(screen, 'service', app); await app.screenshot('service-authentication-success'); await session.save('service'); }
  finally { resetUiBridge(); }
});
