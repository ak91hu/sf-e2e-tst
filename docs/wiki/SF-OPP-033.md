# SF-OPP-033 — Persist Tracking Number

[All test designs](https://github.com/ak91hu/sf-e2e-tst/wiki) · [Executable source](https://github.com/ak91hu/sf-e2e-tst/blob/main/tests/opportunity.e2e.ts) · [Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tracking Number = TRACK-100-A1. Exact configured UI maximum: 12 characters.

The following steps define expected behavior. Execution status is recorded in Allure and [verification evidence](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/VERIFICATION.md); this page does not claim an execution result. Generated dates, names and IDs are substituted at runtime.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Tracking Number to the specified value; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tracking Number = TRACK-100-A1. Exact configured UI maximum: 12 characters. | Dialog closes; entered value verified before Save. |
| 7. Read fresh Details with full Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tracking Number = TRACK-100-A1. Exact configured UI maximum: 12 characters. | Exact Tracking Number value; original fields, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

Generated from [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Update the source, then run `npm run design:generate` and `npm run wiki:generate`.
