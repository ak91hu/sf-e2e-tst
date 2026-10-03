import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Salesforce UI regression',
  historyPath: process.env.E2E_ALLURE_HISTORY_PATH || './test-history/history.jsonl',
  appendHistory: true,
  historyLimit: 20,
  plugins: {
    awesome: { options: { reportName: 'Salesforce UI regression', reportLanguage: 'en', singleFile: true, open: false, publish: false } },
  },
});
