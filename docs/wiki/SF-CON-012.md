# SF-CON-012 — Cancel Contract activation

[All test designs](https://github.com/ak91hu/sf-e2e-tst/wiki) · [Executable source](https://github.com/ak91hu/sf-e2e-tst/blob/main/tests/contract.e2e.ts) · [Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Draft Contract; term 12.

The following steps define expected behavior. Execution status is recorded in Allure and [verification evidence](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/VERIFICATION.md); this page does not claim an execution result. Generated dates, names and IDs are substituted at runtime.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Open Show more actions → Activate; Cancel the confirmation. | Owned Draft Contract ID; Activate confirmation; Cancel button. | The activation dialog closes; the Contract remains Draft. |
| 7. Open fresh Details. | Status Draft; ContractTerm 12; owned Account name and marker. | Draft, 12 months and owned Account persist; the Description marker identifies the same record. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

Generated from [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Update the source, then run `npm run design:generate` and `npm run wiki:generate`.
