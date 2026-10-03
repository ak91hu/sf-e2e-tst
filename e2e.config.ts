import type { E2EConfig } from 'e2e';
import { salesforceWeb } from './support/auth-engine.ts';
import { allureReporter } from './reporting/allure.ts';
import { environment } from './support/environment.ts';
import { uiBridgeField, serviceUiBridgeField } from './support/oauth.ts';

export default {
  projectId: 'salesforce-opportunity-regression',
  tests: ['tests/auth*.e2e.ts', 'tests/opportunity.e2e.ts', 'tests/contract.e2e.ts', 'tests/quote.e2e.ts', 'tests/integration.e2e.ts', 'tests/roles.e2e.ts'],
  targets: [{
    name: 'salesforce-chromium',
    engine: salesforceWeb({ browser: 'chromium', viewport: { width: 1440, height: 1000 } }),
    app: { url: environment.baseUrl, environment: 'test' },
  }],
  workers: 1,
  retries: 0,
  timeout: 600_000,
  launchTimeout: 90_000,
  actionTimeout: 45_000,
  assertionTimeout: 30_000,
  cleanupTimeout: 300_000,
  reporters: ['list', 'junit', 'markdown', allureReporter],
  // Native engine-held authentication allows masked failure screenshots.
  // Keep traces/videos off as they can contain Salesforce session information.
  trace: 'off',
  video: 'off',
  cache: 'off',
  secrets: {
    salesforceUiToken: () => uiBridgeField('otp'),
    salesforceUiChecksum: () => uiBridgeField('cshc'),
    serviceUiToken: () => serviceUiBridgeField('otp'),
    serviceUiChecksum: () => serviceUiBridgeField('cshc'),
  },
} satisfies E2EConfig;
