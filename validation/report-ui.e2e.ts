import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('Generated Allure HTML renders in Chromium', async ({ app, browser, screen }) => {
  await app.open('/');
  await expect.poll(() => browser.evaluate(() => document.body.innerText.includes('Salesforce UI regression'))).toBe(true);
  if (process.env.E2E_REPORT_CASE) {
    await expect(screen.getByRole('textbox', 'Search tests', { exact: true })).toBeVisible();
    const expand = screen.getByRole('button', 'Expand all', { exact: true });
    if (await expand.count()) await expand.tap();
    await screen.getByText(process.env.E2E_REPORT_CASE, { exact: true }).tap();
    if (process.env.E2E_REPORT_DESIGN) {
      // Allure isolates the description inside its visible iframe.
      const design = browser.frameLocator('iframe[title="Description"]');
      await expect(design.getByText('Role: E2E Sales Manager', { exact: true })).toBeVisible();
      await expect(design.getByText(/^Preconditions:/)).toBeVisible();
      await expect(design.getByText(/^Data:/)).toBeVisible();
      await expect(design.getByText(/Expected:/).first()).toBeVisible();
      await expect(design.getByText(/^TesterArmy e2e UI test\. Source:.*Cleanup:/)).toBeVisible();
    } else {
      await expect(screen.getByText('Detailed attempt log', { exact: true })).toBeVisible();
      await expect(screen.getByText('Failure URL', { exact: true })).toBeVisible();
      await expect(screen.getByText('Screenshot at failure', { exact: true })).toBeVisible();
    }
    console.log({ case: process.env.E2E_REPORT_CASE, evidence: process.env.E2E_REPORT_DESIGN ? 'Visible test design verified' : 'Failure log, URL and screenshot verified' });
  }
  await app.screenshot('allure-report-rendered');
});
