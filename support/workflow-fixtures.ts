import { test as base } from './core-fixtures.ts';
import { resetUiBridge } from './oauth.ts';
import { switchSalesforcePersona } from './ui-login.ts';
import { WorkflowPersonas } from './workflow-personas.ts';

export const test = base.extend<{ personas: WorkflowPersonas }>({
  personas: async ({ sales, app, screen, browser, salesforceAuth }, use) => {
    // The dependency makes persona restoration precede owned-record cleanup.
    void sales;
    const personas = new WorkflowPersonas(async role => {
      resetUiBridge();
      await switchSalesforcePersona(app, screen, browser, role, salesforceAuth);
    });
    try { await use(personas); } finally { await personas.restoreForCleanup(); }
  },
});
