import { web } from '@e2e-dev/web';
import type { E2EConfig } from 'e2e';
export default {
  projectId: 'allure-html-ui-validation', tests: ['validation/report-ui.e2e.ts'],
  targets: [{ name: 'allure-chromium', engine: web({ browser: 'chromium', viewport: { width: 1440, height: 1000 } }), app: { url: process.env.E2E_REPORT_URL || 'http://127.0.0.1:7819' } }],
  workers: 1, retries: 0, timeout: 60_000, assertionTimeout: 10_000,
  reporters: ['list'], trace: 'off', video: 'off',
} satisfies E2EConfig;
