import { test as base } from './auth-engine.ts';
import { SalesUi } from './sales-ui.ts';

export const test = base.extend<{ sales: SalesUi }>({
  sales: async ({ app, screen, browser, recordEvidence }, use) => {
    const sales = new SalesUi(app, screen, browser);
    try { await use(sales); } finally {
      await sales.owned.cleanup();
      await recordEvidence.publish(sales.owned.records);
      await app.screenshot('test-completion-evidence');
    }
  },
});
