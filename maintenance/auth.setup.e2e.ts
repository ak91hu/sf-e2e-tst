import { test } from '../support/auth-engine.ts';
import { readJwtConfig, resetUiBridge } from '../support/oauth.ts';
import { openSalesforceSession, verifySalesforcePersona } from '../support/ui-login.ts';
import { environment } from '../support/environment.ts';

test.setup('SF-MAINT-AUTH | Exact journal UI recovery session', { sessions: ['salesforce'], timeout: 150_000 }, async ({ app, screen, browser, session, salesforceAuth }) => {
  const files = JSON.parse(process.env.E2E_RECOVERY_JOURNALS || '[]');
  if (!Array.isArray(files) || !files.length) throw new Error('Recovery requires exact registered journal paths.');
  if (![process.env.SF_SALES_USERNAME, process.env.SF_USERNAME].filter(Boolean).includes(environment.username)) throw new Error('Unknown recovery identity.');
  readJwtConfig(); resetUiBridge();
  try {
    await openSalesforceSession(app, screen, browser, 'sales', salesforceAuth);
    if (environment.username === process.env.SF_SALES_USERNAME) await verifySalesforcePersona(screen, 'sales');
    await session.save('salesforce');
  } finally { resetUiBridge(); }
});

test.setup('SF-MAINT-AUTH-SERVICE | Service journal UI recovery session', { sessions: ['service'], timeout: 150_000 }, async ({ app, screen, browser, session, salesforceAuth }) => {
  if (!JSON.parse(process.env.E2E_RECOVERY_JOURNALS || '[]').length) throw new Error('Recovery requires exact registered journal paths.');
  resetUiBridge();
  try {
    await openSalesforceSession(app, screen, browser, 'service', salesforceAuth); await verifySalesforcePersona(screen, 'service'); await session.save('service');
  } finally { resetUiBridge(); }
});
