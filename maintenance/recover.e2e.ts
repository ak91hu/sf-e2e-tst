import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { test } from '../support/core-fixtures.ts';
import { expect } from 'e2e';
import { environment } from '../support/environment.ts';
import type { UiRecord, UiObject } from '../support/ui-records.ts';
import type { SalesUi } from '../support/sales-ui.ts';

type Journal = { org: string; mode?: string; records: (UiRecord & { path?: string })[] };
const files: string[] = JSON.parse(process.env.E2E_RECOVERY_JOURNALS || '[]');
if (!files.length) throw new Error('Use npm run data:recover -- <exact journal paths>.');
const evidenceKey = (record: UiRecord) => [record.object, record.id, record.name].join('|');
const types: Record<UiObject, string> = { Account: 'Account', Opportunity: 'Opportunity', Quote: 'Quote', Contract: 'Contract', Case: 'Case', Product2: 'Product', Pricebook2: 'Price Book' };

function previousUiDeletions() {
  const evidence = new Set<string>();
  for (const file of readdirSync('.e2e-data').filter(file => /^E2E-TA-attempt-[a-z0-9]+-[a-f0-9]{8}\.json$/.test(file))) {
    const journal: Journal = JSON.parse(readFileSync(resolve('.e2e-data', file), 'utf8'));
    if (journal.org !== environment.baseUrl || journal.mode !== 'ui' || !Array.isArray(journal.records)) continue;
    for (const record of journal.records) if (record.deleted && record.id && record.name.startsWith('E2E-TA-')) evidence.add(evidenceKey(record));
  }
  return evidence;
}

async function inOwnRecycleBin(sales: SalesUi, entry: UiRecord) {
  const name = ['Contract', 'Case'].includes(entry.object) ? entry.displayName : entry.name;
  if (!name) throw new Error('Deleted Contract/Case requires its exact journaled record number.');
  // Classic exposes a native search; this org's Lightning Recycle Bin does not.
  await sales.app.open('/search/UndeletePage');
  const search = sales.screen.getByRole('textbox', 'Search', { visible: true }); await expect(search).toBeVisible();
  await search.fill(name); await sales.screen.getByRole('button', 'Search', { visible: true }).last().tap();
  await expect(search).toHaveValue(name);
  const rows = await sales.browser.evaluate(() => [...document.querySelectorAll<HTMLInputElement>('input[name="ids"]')]
    .filter(input => input.getBoundingClientRect().height > 0)
    .map(input => { const row = input.closest('tr')!; const cells = [...row.children] as HTMLElement[]; return { name: cells[1].innerText.trim(), type: cells[2].innerText.trim() }; }));
  return rows.some(row => row.name === name && row.type === types[entry.object]);
}

for (const file of files) {
  const hint: Journal = JSON.parse(readFileSync(file, 'utf8'));
  // Case fixtures belong to Service; Sales receives no additional permissions.
  const session = Array.isArray(hint.records) && hint.records.some(record => record.object === 'Case') ? 'service' : 'salesforce';
  test(`SF-RECOVERY | ${basename(file)}`, { session }, async ({ sales }) => {
    const journal: Journal = JSON.parse(readFileSync(file, 'utf8'));
    if (journal.org !== environment.baseUrl || !Array.isArray(journal.records)) throw new Error('Wrong journal org.');
    const priorUiDeletions = previousUiDeletions(); const verifiedAbsent = new Set<string>();
    try {
      await sales.app.open('/lightning/o/Opportunity/list');
      for (const entry of journal.records.filter(record => !record.deleted)) {
        if (!Object.hasOwn(types, entry.object) || !entry.name.startsWith('E2E-TA-')) throw new Error('Unknown journal fixture.');
        if (entry.path && !entry.id) entry.id = new URL(entry.path, environment.baseUrl).pathname.split('/').at(-2);
        if (entry.id && !/^[A-Za-z0-9]{15,18}$/.test(entry.id)) throw new Error('Invalid journal ID.');
        entry.marker ||= entry.name;
        if (entry.object === 'Contract' && !entry.accountName) entry.accountName = journal.records.find(record => record.object === 'Account')?.name;
        if (entry.id) {
          await sales.app.open(`/lightning/r/${entry.object}/${entry.id}/view`);
          const unavailable = () => sales.browser.evaluate(() => ({
            missing: document.body.innerText.includes("We couldn't find the record you're trying to access."),
            denied: document.body.innerText.includes('You do not have the level of access necessary to perform the operation you requested.'),
          }));
          await expect.poll(async () => { const state = await unavailable(); return state.missing || state.denied || await sales.screen.getByRole('tab', 'Details', { visible: true }).count() > 0; }).toBe(true);
          const state = await unavailable();
          if (state.missing || state.denied) {
            // Missing alone can mean denied access. Require a prior successful
            // UI deletion, an exact Recycle Bin name/type, or a freshly verified
            // deleted standard parent (cascade-deleted children can be hidden).
            const parentObject = entry.object === 'Quote' ? 'Opportunity' : ['Opportunity', 'Contract'].includes(entry.object) ? 'Account' : undefined;
            const parent = parentObject && journal.records.find(record => record.object === parentObject);
            const cascade = !!parent?.id && parent.deleted && verifiedAbsent.has(parent.id);
            const knownDeletion = !state.denied && (priorUiDeletions.has(evidenceKey(entry)) || cascade);
            if (!knownDeletion && !await inOwnRecycleBin(sales, entry)) throw new Error(`No UI deletion evidence for the exact ${entry.object} journal fixture; inaccessible records are never assumed deleted.`);
            entry.deleted = true; verifiedAbsent.add(entry.id); writeFileSync(file, JSON.stringify(journal, null, 2)); continue;
          }
        }
        sales.owned.records.push(entry);
      }
    } finally {
      // Persist successful partial UI cleanup even if a later proof fails.
      try { await sales.owned.cleanup(); }
      finally { writeFileSync(file, JSON.stringify(journal, null, 2)); }
    }
  });
}
