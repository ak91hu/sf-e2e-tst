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
  test('SF-CON-007 | Preserve Draft Contract across repeated navigation', { tags: ['retention'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    await sales.opportunities.assertListCanCreate();
    expect(await sales.read(contract.record)).toMatchObject({ Status: 'Draft', ContractTerm: contract.term, AccountName: contract.account.name, Description: contract.record.marker });
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
  test('SF-CON-014 | Create a thirty-six-month Draft Contract', { tags: ['expansion-100', 'boundary'] }, async ({ sales }) => {
    await sales.contracts.create(await sales.accounts.create(), 36);
  });
  for (const [id, term] of [['015', 1], ['016', 36]] as const) {
    test(`SF-CON-${id} | Edit a Draft Contract term to ${term} months`, { tags: ['expansion-100', 'edit', 'boundary'] }, async ({ sales }) => {
      const contract = await sales.contracts.create(await sales.accounts.create());
      await sales.form('Contract', {}, contract.record.id); await sales.fill('Contract Term (months)', term); await sales.save();
      expect(await sales.read(contract.record)).toMatchObject({ ContractTerm: term, StartDate: contract.startDate, SpecialTerms: contract.specialTerms, Status: 'Draft', AccountName: contract.account.name });
    });
  }
  for (const [id, terms] of [['017', ''], ['018', 'Első sor: őű & feltételek.\nSecond line: delivery in 30 days.']] as const) {
    test(`SF-CON-${id} | Persist ${terms ? 'multiline Unicode' : 'empty'} Special Terms`, { tags: ['expansion-100', 'edit'] }, async ({ sales }) => {
      const contract = await sales.contracts.create(await sales.accounts.create());
      await sales.form('Contract', {}, contract.record.id); await sales.fill('Special Terms', terms); await sales.save();
      expect(await sales.read(contract.record)).toMatchObject({ SpecialTerms: terms, ContractTerm: contract.term, StartDate: contract.startDate, Status: 'Draft', AccountName: contract.account.name });
    });
  }
  test('SF-CON-019 | Cancel Special Terms editing', { tags: ['expansion-100', 'cancel'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    await sales.form('Contract', {}, contract.record.id); await sales.fill('Special Terms', 'Unsaved terms: áéőű & clauses.'); await sales.cancel();
    expect(await sales.read(contract.record)).toMatchObject({ SpecialTerms: contract.specialTerms, ContractTerm: contract.term, StartDate: contract.startDate, Status: 'Draft', AccountName: contract.account.name });
  });
  test('SF-CON-020 | Edit Contract Start Date into the past', { tags: ['expansion-100', 'edit', 'date'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create()); const startDate = futureDate(-7);
    await sales.form('Contract', {}, contract.record.id); await sales.date('Contract Start Date', startDate); await sales.save();
    expect(await sales.read(contract.record)).toMatchObject({ StartDate: startDate, ContractTerm: contract.term, SpecialTerms: contract.specialTerms, Status: 'Draft', AccountName: contract.account.name });
  });
  test('SF-CON-021 | Cancel Contract Start Date editing', { tags: ['expansion-100', 'cancel', 'date'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create());
    await sales.form('Contract', {}, contract.record.id); await sales.date('Contract Start Date', futureDate(30)); await sales.cancel();
    expect(await sales.read(contract.record)).toMatchObject({ StartDate: contract.startDate, ContractTerm: contract.term, SpecialTerms: contract.specialTerms, Status: 'Draft', AccountName: contract.account.name });
  });
  test('SF-CON-022 | Isolate two Draft Contracts sharing an Account', { tags: ['expansion-100', 'relationships'] }, async ({ sales }) => {
    const account = await sales.accounts.create(); const first = await sales.contracts.create(account); const second = await sales.contracts.create(account); const terms = 'First Contract only: őű & 24 months.';
    await sales.form('Contract', {}, first.record.id); await sales.fill('Contract Term (months)', 24); await sales.fill('Special Terms', terms); await sales.save();
    expect(first.record.id).not.toBe(second.record.id);
    expect(await sales.read(first.record)).toMatchObject({ ContractTerm: 24, SpecialTerms: terms, StartDate: first.startDate, Status: 'Draft', AccountName: account.name });
    expect(await sales.read(second.record)).toMatchObject({ ContractTerm: second.term, SpecialTerms: second.specialTerms, StartDate: second.startDate, Status: 'Draft', AccountName: account.name });
  });
  test('SF-CON-023 | Revise the Contract Description ownership marker', { tags: ['expansion-100', 'edit'] }, async ({ sales }) => {
    const contract = await sales.contracts.create(await sales.accounts.create()); const marker = uniqueName('RevisedContractMarker');
    await sales.form('Contract', {}, contract.record.id); await sales.fill('Description', marker); await sales.save();
    contract.record.marker = marker; sales.owned.persist();
    expect(await sales.read(contract.record)).toMatchObject({ Description: marker, SpecialTerms: contract.specialTerms, ContractTerm: contract.term, StartDate: contract.startDate, Status: 'Draft', AccountName: contract.account.name });
  });
});
