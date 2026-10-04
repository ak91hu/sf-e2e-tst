# SF-ROLE-002 — Service Manager cannot create Opportunities

[All test designs](https://github.com/ak91hu/sf-e2e-tst/wiki) · [Executable source](https://github.com/ak91hu/sf-e2e-tst/blob/main/tests/roles.e2e.ts) · [Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

**Role:** E2E Service Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Service session; no created business record.

The following steps define expected behavior. Execution status is recorded in Allure and [verification evidence](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/VERIFICATION.md); this page does not claim an execution result. Generated dates, names and IDs are substituted at runtime.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Service Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open Opportunity list view. | Service session; no created business record. | Search this list visible; New button count zero. |
| 3. Navigate through UI directly to /lightning/o/Opportunity/new. | Service session; no created business record. | Visible insufficient-permission message; no Save dialog. |
| 4. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

Generated from [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Update the source, then run `npm run design:generate` and `npm run wiki:generate`.
