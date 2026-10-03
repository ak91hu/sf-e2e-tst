# SF-ROLE-003 — Service Manager creates and edits a Case

[All test designs](https://github.com/ak91hu/sf-e2e-tst/wiki) · [Executable source](https://github.com/ak91hu/sf-e2e-tst/blob/main/tests/roles.e2e.ts) · [Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

**Role:** E2E Service Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name.

The following steps define expected behavior. Execution status is recorded in Allure and [verification evidence](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/VERIFICATION.md); this page does not claim an execution result. Generated dates, names and IDs are substituted at runtime.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Service Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Case under the owned Account; enter Subject, New, Phone and Description; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name. | Dialog closes; owned Case ID known. |
| 5. Open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name. | Subject exactly owned name; New; Created By = E2E Service Manager; owned Description marker and Case Number verified. |
| 6. Open Edit; select Working; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name. | Working; owned record identity and Description marker correct. |
| 7. Fixture teardown deletes only this case’s journaled records through UI in dependency order; discard unfinished forms. | This case’s exact owned record IDs, names and Description markers in .e2e-data; order: Quote, Contract, Opportunity, Case, Price Book, Product, Account. | The UI leaves each deleted record URL; exact-name search finds no record. Journal deleted becomes true only after proven deletion or absence. Failed cleanup retains the journal for targeted UI recovery. |

Generated from [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Update the source, then run `npm run design:generate` and `npm run wiki:generate`.
