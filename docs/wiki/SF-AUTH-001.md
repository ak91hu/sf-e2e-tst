# SF-AUTH-001 — Authenticated Opportunity list is accessible

[All test designs](https://github.com/ak91hu/sf-e2e-tst/wiki) · [Executable source](https://github.com/ak91hu/sf-e2e-tst/blob/main/tests/auth.e2e.ts) · [Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Saved Sales session; no business data.

The following steps define expected behavior. Execution status is recorded in Allure and [verification evidence](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/VERIFICATION.md); this page does not claim an execution result. Generated dates, names and IDs are substituted at runtime.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open the Opportunity list view. | Saved Sales session; no business data. | URL is /lightning/o/Opportunity/list; New is visible. |
| 3. Fixture teardown deletes only this case’s journaled records through UI in dependency order; discard unfinished forms. | This case’s exact owned record IDs, names and Description markers in .e2e-data; order: Quote, Contract, Opportunity, Case, Price Book, Product, Account. | The UI leaves each deleted record URL; exact-name search finds no record. Journal deleted becomes true only after proven deletion or absence. Failed cleanup retains the journal for targeted UI recovery. |

Generated from [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Update the source, then run `npm run design:generate` and `npm run wiki:generate`.
