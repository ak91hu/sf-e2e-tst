import { expect } from 'e2e';
import { test } from '../support/core-fixtures.ts';
import { uniqueName } from '../support/data.ts';

test('SF-ROLE-001 | Sales Manager hozza létre és birtokolja az Opportunityt', { session: 'salesforce', tags: ['regression', 'roles', 'smoke'] }, async ({ sales }) => {
  const deal = await sales.opportunities.create(await sales.accounts.create(), 'SalesPersona');
  await sales.opportunities.assert(deal);
});
test('SF-ROLE-002 | Service Manager nem hozhat létre Opportunityt', { session: 'service', tags: ['regression', 'roles', 'service'] }, async ({ sales }) => {
  await sales.service.assertCannotCreateOpportunity();
});
test('SF-ROLE-003 | Service Manager UI-n létrehoz és szerkeszt egy Case-t', { session: 'service', tags: ['regression', 'roles', 'service'] }, async ({ sales }) => {
  const saved = await sales.service.createCase(await sales.accounts.create());
  const initial = await sales.read(saved); expect(initial.Subject).toBe(saved.name); expect(initial.Status).toBe('New');
  expect(String(initial['Created By']).split('\n')[0]).toBe('E2E Service Manager');
  await sales.service.changeCaseStatus(saved, 'Working');
  expect((await sales.read(saved)).Status).toBe('Working');
});
