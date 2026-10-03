import { expect } from 'e2e';
import { test } from '../support/core-fixtures.ts';
import { futureDate, uniqueName } from '../support/data.ts';

test.describe('Salesforce Contract regression', { session: 'salesforce', tags: ['regression', 'contract'] }, () => {
  test('SF-CON-001 | Create Draft and persist Account and term', { tags: ['smoke'] }, async ({ sales }) => {
    await sales.contracts.create(await sales.accounts.create());
  });
  for (const [id, field] of [['002', 'Account Name'], ['003', 'Contract Start Date'], ['004', 'Contract Term (months)']] as const) {
    test(`SF-CON-${id} | Required field: ${field}`, { tags: ['validation'] }, async ({ sales }) => {
      const account = await sales.accounts.create(); const record = sales.owned.claim('Contract', uniqueName('RequiredContract'), undefined, account.name);
      await sales.form('Contract', field === 'Account Name' ? {} : { AccountId: account.id });
      await sales.date('Contract Start Date', field === 'Contract Start Date' ? '' : futureDate(0));
      await sales.fill('Contract Term (months)', field === 'Contract Term (months)' ? '' : 12); await sales.fill('Description', record.marker);
      await sales.submit(); await expect(sales.field(field)).toHaveAttribute('aria-invalid', 'true');
      await sales.cancel(); await sales.assertAbsent(record);
    });
  }
  test('SF-CON-005 | Edit Draft and Unicode terms', { tags: ['edit'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    await sales.form('Contract', {}, contract.record.id); await sales.fill('Contract Term (months)', 24);
    await sales.fill('Special Terms', 'Updated terms: őű & clauses.'); await sales.save();
    expect(await sales.read(contract.record))
      .toMatchObject({ ContractTerm: 24, SpecialTerms: 'Updated terms: őű & clauses.', Status: 'Draft' });
  });
  test('SF-CON-006 | Cancel editing', { tags: ['cancel'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    await sales.form('Contract', {}, contract.record.id); await sales.fill('Contract Term (months)', 36); await sales.cancel();
    expect((await sales.read(contract.record)).ContractTerm).toBe(contract.term);
  });
  test('SF-CON-007 | Delete Draft through UI', { tags: ['delete'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create()); await sales.delete(contract.record);
  });
  test('SF-CON-008 | Activate and preserve the Account relationship', { tags: ['smoke', 'lifecycle'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    const actual = await sales.contracts.activate(contract.record);
    expect(actual).toMatchObject({ Status: 'Activated', AccountName: contract.account.name });
    expect(actual.ActivatedDate).toBeTruthy();
  });
  test('SF-CON-009 | Cancel a completed creation form', { tags: ['cancel'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const record = sales.owned.claim('Contract', uniqueName('CancelContract'), undefined, account.name);
    await sales.form('Contract', { AccountId: account.id }); await sales.date('Contract Start Date', futureDate(0));
    await sales.fill('Contract Term (months)', 12); await sales.fill('Description', record.marker); await sales.cancel(); await sales.assertAbsent(record);
  });
  test('SF-CON-010 | Edit Start Date while preserving the owned Account and term', { tags: ['date', 'edit'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create()); const startDate = futureDate(7);
    await sales.form('Contract', {}, contract.record.id); await sales.date('Contract Start Date', startDate); await sales.save();
    expect(await sales.read(contract.record)).toMatchObject({ StartDate: startDate, ContractTerm: 12, AccountName: contract.account.name, Status: 'Draft', Description: contract.record.marker });
  });
  test('SF-CON-011 | Persist a one-month Draft Contract', { tags: ['boundary'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create(), 1);
    expect(await sales.read(contract.record)).toMatchObject({ ContractTerm: 1, Status: 'Draft', AccountName: contract.account.name });
  });
  test('SF-CON-012 | Cancel Contract activation and retain Draft', { tags: ['cancel', 'lifecycle'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    expect(await sales.contracts.cancelActivation(contract.record)).toMatchObject({ Status: 'Draft', ContractTerm: 12, AccountName: contract.account.name });
  });
  test('SF-CON-013 | Cancel Draft Contract deletion', { tags: ['cancel', 'delete'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    await sales.deleteDialog(contract.record); await sales.cancel();
    expect(await sales.read(contract.record)).toMatchObject({ Status: 'Draft', ContractTerm: 12, AccountName: contract.account.name, Description: contract.record.marker });
  });
});
