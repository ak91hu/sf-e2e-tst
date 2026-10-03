import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readableStepName } from '../reporting/step-names.ts';

test('Allure action names identify the final target rather than its enclosing Save dialog', () => {
  const form = 'getByRole("dialog", visible: true).filter({ has: getByRole("button", name: "Save") })';
  assert.equal(readableStepName('locator.fill', `${form} >> getByLabel(/^\\*?\\s*Opportunity Name$/i, visible: true)`), 'Enter Opportunity Name');
  assert.equal(readableStepName('locator.tap', `${form} >> getByRole("button", name: "Save")`), 'Click Save');
  assert.equal(readableStepName('expect.not.toBeVisible', form), 'Check dialog is closed or hidden');
});

test('Page and persona names stay readable without exposing query values', () => {
  assert.equal(readableStepName('browser.goto', '/lightning/r/Opportunity/006000000000001AAA/edit?count=1'), 'Open Opportunity edit form');
  assert.equal(readableStepName('browser.goto', '/lightning/o/Opportunity/new?defaultFieldValues=AccountId%3D001000000000001AAA'), 'Open Opportunity creation form');
  assert.equal(readableStepName('browser.goto', '/lightning/o/Opportunity/list'), 'Open Opportunity list');
  assert.equal(readableStepName('salesforceAuth.open', 'Native Salesforce authentication (service)'), 'Sign in as Service Manager');
  assert.equal(readableStepName('browser.goto', '/secur/frontdoor.jsp?sid=never-display-this'), 'Open page');
});
