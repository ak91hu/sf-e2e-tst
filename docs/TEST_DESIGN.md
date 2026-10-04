# Salesforce UI step-level test designs

100 designs: 95 default regression UI cases, 3 AI UI cases and 2 authentication setups. The complete test:all run selects exactly 100 results (98 cases + 2 setups). Designs specify intended behavior; actual execution evidence is recorded in VERIFICATION.md and Allure. Every case expands preparation and permanent-retention evidence steps.

Salesforce business data is created and verified exclusively through UI, and every created record remains in the sandbox permanently. Deletion confirmations are never accepted; destructive recovery is disabled. Successful results include redacted PNG screenshots and exact record links. Authentication endpoints and one-time administrative provisioning are configuration infrastructure. Each case owns isolated data; administrators never create Opportunities. Visible fields, controls, record URLs and list results prove each step. There are no fixed sleeps, API oracles or automatic test retries.

Dates are generated at runtime. `futureDate` uses UTC; the automatic Salesforce Closed Won date follows the user timezone (`SF_TIME_ZONE`, default Europe/Budapest). Environment variables configure Stage names and Won/Lost percentages for other sales processes; these designs describe the configured Developer Edition defaults. Optional AI cases require model access and quota.

Editable source: [test-design.ts](test-design.ts). Generate with `npm run design:generate`; verify with `npm run design:check`. Allure displays these same expected steps in each matched case description.

| ID | Objective | Role |
| --- | --- | --- |
| [SF-AUTH-001](#sf-auth-001) | Authenticated Opportunity list is accessible | E2E Sales Manager |
| [SF-OPP-001](#sf-opp-001) | Complete Opportunity sales lifecycle | E2E Sales Manager |
| [SF-OPP-002](#sf-opp-002) | Required field: Opportunity Name | E2E Sales Manager |
| [SF-OPP-003](#sf-opp-003) | Required field: Close Date | E2E Sales Manager |
| [SF-OPP-004](#sf-opp-004) | Required field: Stage | E2E Sales Manager |
| [SF-OPP-005](#sf-opp-005) | Cancel Opportunity creation | E2E Sales Manager |
| [SF-OPP-006](#sf-opp-006) | Edit Opportunity name, amount, date and Unicode description | E2E Sales Manager |
| [SF-OPP-007](#sf-opp-007) | Cancel Opportunity editing | E2E Sales Manager |
| [SF-OPP-008](#sf-opp-008) | Closed Lost and automatic probability | E2E Sales Manager |
| [SF-OPP-009](#sf-opp-009) | Reopen Closed Lost | E2E Sales Manager |
| [SF-OPP-010](#sf-opp-010) | Cancel Opportunity deletion | E2E Sales Manager |
| [SF-OPP-011](#sf-opp-011) | Preserve Opportunity and its Quote after cancelled deletion | E2E Sales Manager |
| [SF-OPP-012](#sf-opp-012) | Persist Opportunity amount: 0 | E2E Sales Manager |
| [SF-OPP-013](#sf-opp-013) | Persist Opportunity amount: 0.01 | E2E Sales Manager |
| [SF-CON-001](#sf-con-001) | Create Draft Contract | E2E Sales Manager |
| [SF-CON-002](#sf-con-002) | Required Contract field: Account Name | E2E Sales Manager |
| [SF-CON-003](#sf-con-003) | Required Contract field: Contract Start Date | E2E Sales Manager |
| [SF-CON-004](#sf-con-004) | Required Contract field: Contract Term (months) | E2E Sales Manager |
| [SF-CON-005](#sf-con-005) | Edit Draft Contract Unicode terms | E2E Sales Manager |
| [SF-CON-006](#sf-con-006) | Cancel Contract editing | E2E Sales Manager |
| [SF-CON-007](#sf-con-007) | Preserve Draft Contract across repeated navigation | E2E Sales Manager |
| [SF-CON-008](#sf-con-008) | Activate Contract | E2E Sales Manager |
| [SF-CON-009](#sf-con-009) | Cancel completed Contract creation | E2E Sales Manager |
| [SF-QUO-001](#sf-quo-001) | Draft Quote relationships and expiry | E2E Sales Manager |
| [SF-QUO-002](#sf-quo-002) | Required Quote Name | E2E Sales Manager |
| [SF-QUO-003](#sf-quo-003) | Cancel Quote creation | E2E Sales Manager |
| [SF-QUO-004](#sf-quo-004) | Edit Quote fields and costs | E2E Sales Manager |
| [SF-QUO-005](#sf-quo-005) | Cancel Quote editing | E2E Sales Manager |
| [SF-QUO-006](#sf-quo-006) | Quote Presented → Accepted | E2E Sales Manager |
| [SF-QUO-007](#sf-quo-007) | Cancel Quote deletion | E2E Sales Manager |
| [SF-QUO-008](#sf-quo-008) | Preserve Quote and Opportunity across repeated navigation | E2E Sales Manager |
| [SF-QUO-009](#sf-quo-009) | Product line, totals and synchronization | E2E Sales Manager |
| [SF-ROLE-001](#sf-role-001) | Sales Manager is Opportunity owner and creator | E2E Sales Manager |
| [SF-ROLE-002](#sf-role-002) | Service Manager cannot create Opportunities | E2E Service Manager |
| [SF-ROLE-003](#sf-role-003) | Service Manager creates and edits a Case | E2E Service Manager |
| [SF-E2E-001](#sf-e2e-001) | Complete Sales → Service handoff | E2E Sales Manager → E2E Service Manager → E2E Sales Manager |
| [SF-AI-001](#sf-ai-001) | AI Opportunity editing | E2E Sales Manager |
| [SF-AI-002](#sf-ai-002) | AI Contract editing and assertion | E2E Sales Manager |
| [SF-AI-003](#sf-ai-003) | AI Quote acceptance and extraction | E2E Sales Manager |
| [SF-AUTH](#sf-auth) | E2E Sales Manager JWT → Lightning session setup | E2E Sales Manager |
| [SF-AUTH-SERVICE](#sf-auth-service) | E2E Service Manager JWT → Lightning session setup | E2E Service Manager |
| [SF-OPP-014](#sf-opp-014) | Persist a past Close Date on an open Opportunity | E2E Sales Manager |
| [SF-OPP-015](#sf-opp-015) | Move an open Opportunity backwards through stages | E2E Sales Manager |
| [SF-OPP-016](#sf-opp-016) | Persist a seven-digit amount with cents | E2E Sales Manager |
| [SF-OPP-017](#sf-opp-017) | Edit a grouped decimal amount back to zero | E2E Sales Manager |
| [SF-CON-010](#sf-con-010) | Edit Contract Start Date | E2E Sales Manager |
| [SF-CON-011](#sf-con-011) | Persist a one-month Draft Contract | E2E Sales Manager |
| [SF-CON-012](#sf-con-012) | Cancel Contract activation | E2E Sales Manager |
| [SF-CON-013](#sf-con-013) | Cancel Draft Contract deletion | E2E Sales Manager |
| [SF-QUO-010](#sf-quo-010) | Deny a Quote without changing its Opportunity | E2E Sales Manager |
| [SF-QUO-011](#sf-quo-011) | Persist a past Quote expiration date | E2E Sales Manager |
| [SF-QUO-012](#sf-quo-012) | Reset Quote tax and shipping to zero | E2E Sales Manager |
| [SF-QUO-013](#sf-quo-013) | Isolate two Quotes under one Opportunity | E2E Sales Manager |
| [SF-E2E-002](#sf-e2e-002) | Complete product sale through Contract and Service handoff | E2E Sales Manager → E2E Service Manager → E2E Sales Manager |
| [SF-E2E-003](#sf-e2e-003) | Recover a lost sale and replace a denied Quote | E2E Sales Manager → E2E Service Manager → E2E Sales Manager |
| [SF-OPP-018](#sf-opp-018) | Persist empty Opportunity description | E2E Sales Manager |
| [SF-OPP-019](#sf-opp-019) | Persist multiline Unicode Opportunity description | E2E Sales Manager |
| [SF-OPP-020](#sf-opp-020) | Edit Opportunity Amount to a small decimal | E2E Sales Manager |
| [SF-OPP-021](#sf-opp-021) | Persist Opportunity Close Date today | E2E Sales Manager |
| [SF-OPP-022](#sf-opp-022) | Persist Opportunity Close Date one year ahead | E2E Sales Manager |
| [SF-OPP-023](#sf-opp-023) | Persist manually entered probability | E2E Sales Manager |
| [SF-OPP-024](#sf-opp-024) | Persist Unicode Next Step | E2E Sales Manager |
| [SF-QUO-014](#sf-quo-014) | Recalculate Quote total with tax 12.34 and shipping 0 | E2E Sales Manager |
| [SF-QUO-015](#sf-quo-015) | Recalculate Quote total with tax 0 and shipping 5.67 | E2E Sales Manager |
| [SF-QUO-016](#sf-quo-016) | Recalculate Quote total with tax 1000000.99 and shipping 12345.67 | E2E Sales Manager |
| [SF-QUO-017](#sf-quo-017) | Recalculate Quote total with tax 0.01 and shipping 0.01 | E2E Sales Manager |
| [SF-QUO-018](#sf-quo-018) | Persist Quote expiration today | E2E Sales Manager |
| [SF-QUO-019](#sf-quo-019) | Persist empty Quote description | E2E Sales Manager |
| [SF-QUO-020](#sf-quo-020) | Persist multiline Unicode Quote description | E2E Sales Manager |
| [SF-QUO-021](#sf-quo-021) | Return Accepted Quote to Draft | E2E Sales Manager |
| [SF-OPP-025](#sf-opp-025) | Clear a saved Unicode Next Step | E2E Sales Manager |
| [SF-OPP-026](#sf-opp-026) | Cancel a manual probability change | E2E Sales Manager |
| [SF-OPP-027](#sf-opp-027) | Persist 0% probability on an open Opportunity | E2E Sales Manager |
| [SF-OPP-028](#sf-opp-028) | Persist 100% probability on an open Opportunity | E2E Sales Manager |
| [SF-OPP-029](#sf-opp-029) | Cancel a Close Date change | E2E Sales Manager |
| [SF-OPP-030](#sf-opp-030) | Edit an open Opportunity Close Date into the past | E2E Sales Manager |
| [SF-OPP-031](#sf-opp-031) | Persist Order Number | E2E Sales Manager |
| [SF-OPP-032](#sf-opp-032) | Persist Main Competitor(s) | E2E Sales Manager |
| [SF-OPP-033](#sf-opp-033) | Persist Tracking Number | E2E Sales Manager |
| [SF-OPP-034](#sf-opp-034) | Isolate edits between Opportunities sharing an Account | E2E Sales Manager |
| [SF-CON-014](#sf-con-014) | Create a thirty-six-month Draft Contract | E2E Sales Manager |
| [SF-CON-015](#sf-con-015) | Edit a Draft Contract term to 1 months | E2E Sales Manager |
| [SF-CON-016](#sf-con-016) | Edit a Draft Contract term to 36 months | E2E Sales Manager |
| [SF-CON-017](#sf-con-017) | Persist empty Special Terms | E2E Sales Manager |
| [SF-CON-018](#sf-con-018) | Persist multiline Unicode Special Terms | E2E Sales Manager |
| [SF-CON-019](#sf-con-019) | Cancel Special Terms editing | E2E Sales Manager |
| [SF-CON-020](#sf-con-020) | Edit Contract Start Date into the past | E2E Sales Manager |
| [SF-CON-021](#sf-con-021) | Cancel Contract Start Date editing | E2E Sales Manager |
| [SF-CON-022](#sf-con-022) | Isolate two Draft Contracts sharing an Account | E2E Sales Manager |
| [SF-CON-023](#sf-con-023) | Revise Contract Description ownership marker | E2E Sales Manager |
| [SF-QUO-022](#sf-quo-022) | Persist Quote expiration one year ahead | E2E Sales Manager |
| [SF-QUO-023](#sf-quo-023) | Cancel Quote expiration editing | E2E Sales Manager |
| [SF-QUO-024](#sf-quo-024) | Cancel Quote tax and shipping editing | E2E Sales Manager |
| [SF-QUO-025](#sf-quo-025) | Quote Presented → Denied without changing its Opportunity | E2E Sales Manager |
| [SF-QUO-026](#sf-quo-026) | Quote Denied → Draft without changing its Opportunity | E2E Sales Manager |
| [SF-QUO-027](#sf-quo-027) | Rename the same Quote twice | E2E Sales Manager |
| [SF-QUO-028](#sf-quo-028) | Edit Tax while preserving the other charge | E2E Sales Manager |
| [SF-QUO-029](#sf-quo-029) | Edit Shipping and Handling while preserving the other charge | E2E Sales Manager |
| [SF-QUO-030](#sf-quo-030) | Cancel Quote Description editing | E2E Sales Manager |
| [SF-QUO-031](#sf-quo-031) | Isolate Quotes belonging to different Opportunities | E2E Sales Manager |

## SF-AUTH-001

**Objective:** Authenticated Opportunity list is accessible

**Source:** [tests/auth.e2e.ts](../tests/auth.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Saved Sales session; no business data.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open the Opportunity list view. | Saved Sales session; no business data. | URL is /lightning/o/Opportunity/list; New is visible. |
| 3. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-001

**Objective:** Complete Opportunity sales lifecycle

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open Edit, select Stage = Qualification, Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won. | Stage = Qualification; name, amount, description, Account and Sales Owner/Created By remain correct. |
| 7. Open Edit, select Stage = Proposal/Price Quote, Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won. | Stage = Proposal/Price Quote; name, amount, description, Account and Sales Owner/Created By remain correct. |
| 8. Open Edit, select Stage = Negotiation/Review, Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won. | Stage = Negotiation/Review; name, amount, description, Account and Sales Owner/Created By remain correct. |
| 9. Set Stage = Closed Won; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won. | Closed Won; Probability = 100%. Salesforce changes future Close Date to the user’s current date; the Budapest date immediately before or after Save is accepted across midnight. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-002

**Objective:** Required field: Opportunity Name

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Opportunity Name; other required fields valid.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Prepare the Opportunity form, leaving only the tested required field empty or --None--. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Opportunity Name; other required fields valid. | Owned Account prefilled; other fields completed; no Opportunity ID before Save. |
| 5. Press Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Opportunity Name; other required fields valid. | Opportunity Name has aria-invalid = true; creation dialog remains open. |
| 6. Cancel and search for the exact owned Opportunity name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Opportunity Name; other required fields valid. | The dialog closes; no matching record exists. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-003

**Objective:** Required field: Close Date

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Close Date; other required fields valid.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Prepare the Opportunity form, leaving only the tested required field empty or --None--. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Close Date; other required fields valid. | Owned Account prefilled; other fields completed; no Opportunity ID before Save. |
| 5. Press Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Close Date; other required fields valid. | Close Date has aria-invalid = true; creation dialog remains open. |
| 6. Cancel and search for the exact owned Opportunity name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Close Date; other required fields valid. | The dialog closes; no matching record exists. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-004

**Objective:** Required field: Stage

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Stage; other required fields valid.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Prepare the Opportunity form, leaving only the tested required field empty or --None--. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Stage; other required fields valid. | Owned Account prefilled; other fields completed; no Opportunity ID before Save. |
| 5. Press Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Stage; other required fields valid. | Stage has aria-invalid = true; creation dialog remains open. |
| 6. Cancel and search for the exact owned Opportunity name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty/--None--: Stage; other required fields valid. | The dialog closes; no matching record exists. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-005

**Objective:** Cancel Opportunity creation

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Prepare a complete Opportunity form with valid defaults. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Entered name, amount, date and Stage verified; record not saved. |
| 5. Cancel and search for the exact name in the Opportunity list. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | The dialog closes; no matching record exists. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-006

**Objective:** Edit Opportunity name, amount, date and Unicode description

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New name; 98765.43 USD; +60 days; “Unicode áéíóöőúüű & symbols.”

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open Edit; enter new name, amount, Close Date and description; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New name; 98765.43 USD; +60 days; “Unicode áéíóöőúüű & symbols.” | The form closes; journal records the new name before saving. |
| 7. Verify fresh Details and the Account link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New name; 98765.43 USD; +60 days; “Unicode áéíóöőúüű & symbols.” | New name, 98765.43, +60-day date and complete Unicode description read back correctly; Stage, Account and Sales Owner/Created By correct. |
| 8. Search for the exact previous name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New name; 98765.43 USD; +60 days; “Unicode áéíóöőúüű & symbols.” | No exact link uses the previous name; asynchronous indexing may temporarily return the renamed row under its new name. |
| 9. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-007

**Objective:** Cancel Opportunity editing

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved name; Amount = 1.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open Edit; enter a new name and Amount = 1; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved name; Amount = 1. | The dialog closes. |
| 7. Open fresh Details and run complete Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved name; Amount = 1. | Original name, 12345.67 USD, date, Stage, description and Account persist; Sales Owner/Created By correct. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-008

**Objective:** Closed Lost and automatic probability

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Closed Lost; 0%.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open Edit; set Stage = Closed Lost; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Closed Lost; 0%. | Closed Lost and 0% Probability; original Close Date, amount and relationships persist. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-009

**Objective:** Reopen Closed Lost

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Closed Lost → Qualification.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Set Stage = Closed Lost; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Closed Lost → Qualification. | Closed Lost; Probability = 0%. |
| 7. Set Stage = Qualification; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Closed Lost → Qualification. | Qualification; 0% < Probability < 100%; record fields, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-010

**Objective:** Cancel Opportunity deletion

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open the Delete action. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Delete confirmation dialog and Delete button visible. |
| 7. Cancel and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | All original record fields and relationships persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-011

**Objective:** Preserve Opportunity and its Quote after cancelled deletion

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Open Opportunity Delete and cancel the confirmation. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | The dialog closes without deleting the parent or its Quote. |
| 9. Read fresh Opportunity and Quote Details and exact relationship link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | All Opportunity fields persist; Quote remains Draft with its original name and exact Opportunity link. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-012

**Objective:** Persist Opportunity amount: 0

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount = 0 USD.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Create an Opportunity with amount 0 under the owned Account; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount = 0 USD. | The dialog closes; URL contains the owned Opportunity ID. |
| 5. Open fresh Details and run complete Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount = 0 USD. | Amount = 0 to two decimal places; name, date, Prospecting, description, Account link and Sales Owner/Created By correct. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-013

**Objective:** Persist Opportunity amount: 0.01

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount = 0.01 USD.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Create an Opportunity with amount 0.01 under the owned Account; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount = 0.01 USD. | The dialog closes; URL contains the owned Opportunity ID. |
| 5. Open fresh Details and run complete Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount = 0.01 USD. | Amount = 0.01 to two decimal places; name, date, Prospecting, description, Account link and Sales Owner/Created By correct. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-001

**Objective:** Create Draft Contract

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date = UTC today; term = 12; Unicode terms.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-002

**Objective:** Required Contract field: Account Name

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Account Name; unique Description marker.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Contract; omit Account Name; complete other required fields and Description. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Account Name; unique Description marker. | The tested field is empty; other data valid. |
| 5. Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Account Name; unique Description marker. | Account Name: aria-invalid = true. |
| 6. Cancel and search Contract list using the owned Account name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Account Name; unique Description marker. | No created Contract matches; unfinished record journal can be closed. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-003

**Objective:** Required Contract field: Contract Start Date

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Start Date; unique Description marker.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Contract; omit Contract Start Date; complete other required fields and Description. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Start Date; unique Description marker. | The tested field is empty; other data valid. |
| 5. Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Start Date; unique Description marker. | Contract Start Date: aria-invalid = true. |
| 6. Cancel and search Contract list using the owned Account name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Start Date; unique Description marker. | No created Contract matches; unfinished record journal can be closed. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-004

**Objective:** Required Contract field: Contract Term (months)

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Term (months); unique Description marker.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Contract; omit Contract Term (months); complete other required fields and Description. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Term (months); unique Description marker. | The tested field is empty; other data valid. |
| 5. Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Term (months); unique Description marker. | Contract Term (months): aria-invalid = true. |
| 6. Cancel and search Contract list using the owned Account name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Contract Term (months); unique Description marker. | No created Contract matches; unfinished record journal can be closed. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-005

**Objective:** Edit Draft Contract Unicode terms

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term = 24; “Updated terms: őű & clauses.”

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Open Edit; enter 24 months and Unicode Special Terms; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term = 24; “Updated terms: őű & clauses.” | The dialog closes. |
| 7. Open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term = 24; “Updated terms: őű & clauses.” | ContractTerm = 24; exact Unicode SpecialTerms; Status = Draft; owned Description marker verified. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-006

**Objective:** Cancel Contract editing

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved term = 36.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Open Edit; enter term = 36; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved term = 36. | The dialog closes. |
| 7. Open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved term = 36. | Original 12 months persist; owned Description marker correct. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-007

**Objective:** Preserve Draft Contract across repeated navigation

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Navigate to the Opportunity list. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | List is accessible and New is visible. |
| 7. Return to fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Same Contract ID; Draft, original term, Account and Description marker persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-008

**Objective:** Activate Contract

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Draft → Activated.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Show more actions → Activate; confirm Activate. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Draft → Activated. | Activate confirmation dialog closes. |
| 7. Open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Draft → Activated. | Activated; AccountName persists; Activated By = E2E Sales Manager; Activated Date nonempty; owned Description marker correct. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-009

**Objective:** Cancel completed Contract creation

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date = UTC today; term = 12; owned marker.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete the New Contract form. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date = UTC today; term = 12; owned marker. | Account, date, 12 months and Description read back correctly. |
| 5. Cancel and search Contract list using the owned Account name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date = UTC today; term = 12; owned marker. | The dialog closes; no Contract matches. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-001

**Objective:** Draft Quote relationships and expiry

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiry = +14 UTC days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-002

**Objective:** Required Quote Name

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Quote Name.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote under the owned Opportunity; leave Quote Name empty; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Quote Name. | Salesforce error dialog appears. |
| 7. Close the error dialog and inspect Quote Name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Quote Name. | Error dialog closes; Quote Name has aria-invalid = true. |
| 8. Cancel and open Opportunity Quotes related list. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Empty Quote Name. | Quotes heading visible; 0 items / No records to display / No results found; no Quote created. |
| 9. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-003

**Objective:** Cancel Quote creation

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Quote name; expiry +14 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote; enter name and expiry. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Quote name; expiry +14 days. | Entered values read back correctly. |
| 7. Cancel and search for the exact Quote name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Quote name; expiry +14 days. | The dialog closes; no Quote matches. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-004

**Objective:** Edit Quote fields and costs

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New name; +45 days; Unicode description; Tax = 12.34; Shipping = 5.67.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Open Edit; enter new name, expiry, “Updated quote: áéőű & text.”, tax and shipping; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New name; +45 days; Unicode description; Tax = 12.34; Shipping = 5.67. | The dialog closes; journal contains the new owned name. |
| 9. Open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New name; +45 days; Unicode description; Tax = 12.34; Shipping = 5.67. | New name, OpportunityName, +45-day expiry and exact description; Tax = 12.34; ShippingHandling = 5.67; GrandTotal = 18.01. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-005

**Objective:** Cancel Quote editing

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved name and Accepted status.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Open Edit; enter a new name and Status = Accepted; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved name and Accepted status. | The dialog closes. |
| 9. Open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved name and Accepted status. | Original Quote Name and Draft Status persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-006

**Objective:** Quote Presented → Accepted

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Open Edit; select Status = Presented; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Status = Presented. |
| 9. Open Edit; select Status = Accepted; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Status = Accepted. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-007

**Objective:** Cancel Quote deletion

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Open Delete. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Delete visible in the confirmation dialog. |
| 9. Cancel and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Original Quote Name remains readable. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-008

**Objective:** Preserve Quote and Opportunity across repeated navigation

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Read the parent Opportunity with all field and ownership assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Original parent fields persist. |
| 9. Return to fresh Quote Details and verify the relationship link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Same Quote ID; original name, Draft status and exact Opportunity link persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-009

**Objective:** Product line, totals and synchronization

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Create owned Product through UI with unique name/code and Active selected; Add Standard Price = 125.50. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD. | Saved dialogs close; owned Product ID known. Global activation of standard price book is not required. |
| 3. Create owned active Price Book through UI; Related → Add Products; select exact Product row, Next, Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD. | Active checked; Price Book Entries (1) and $125.50 in the exact Product row visible. |
| 4. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 5. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 6. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 7. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 8. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 9. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 10. Quote Related → Add Products; verify owned Price Book and Save; select exact Product, Next. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD. | Product checkbox selected; Edit Selected Quote Line Items visible. |
| 11. Set Quantity = 2; Tab; Save; open fresh Details and Related. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD. | Quantity cell 2.00; Subtotal, Total Price and Grand Total = 251.00; Quote Line Items (1) and exact Product link visible. |
| 12. Show more actions → Start Sync → Continue. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD. | Dialog closes; fresh Details: Syncing = true; Opportunity Amount = 251.00; other fields and Sales ownership correct. |
| 13. Show more actions → Stop Sync → Continue. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD. | Syncing = false; Quote Subtotal/Total Price/Grand Total and Opportunity Amount remain 251.00. |
| 14. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-ROLE-001

**Objective:** Sales Manager is Opportunity owner and creator

**Source:** [tests/roles.e2e.ts](../tests/roles.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open fresh Details and run complete Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Opportunity Owner and Created By exactly E2E Sales Manager; owned Account link and record fields correct. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-ROLE-002

**Objective:** Service Manager cannot create Opportunities

**Source:** [tests/roles.e2e.ts](../tests/roles.e2e.ts)

**Role:** E2E Service Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Service session; no created business record.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Service Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open Opportunity list view. | Service session; no created business record. | Search this list visible; New button count zero. |
| 3. Navigate through UI directly to /lightning/o/Opportunity/new. | Service session; no created business record. | Visible insufficient-permission message; no Save dialog. |
| 4. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-ROLE-003

**Objective:** Service Manager creates and edits a Case

**Source:** [tests/roles.e2e.ts](../tests/roles.e2e.ts)

**Role:** E2E Service Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Service Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Case under the owned Account; enter Subject, New, Phone and Description; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name. | Dialog closes; owned Case ID known. |
| 5. Open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name. | Subject exactly owned name; New; Created By = E2E Service Manager; owned Description marker and Case Number verified. |
| 6. Open Edit; select Working; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name. | Working; owned record identity and Description marker correct. |
| 7. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-E2E-001

**Objective:** Complete Sales → Service handoff

**Source:** [tests/integration.e2e.ts](../tests/integration.e2e.ts)

**Role:** E2E Sales Manager → E2E Service Manager → E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager → E2E Service Manager → E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Set Opportunity Stage = Negotiation/Review; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months. | Stage and complete Opportunity assertions correct. |
| 7. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 8. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 9. Open Quote Edit; select Accepted; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months. | Accepted; owned Opportunity Name and Account Name; Opportunity link targets exact owned Opportunity ID. |
| 10. Set Opportunity Stage = Closed Won; Save and open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months. | Closed Won, 100%, current Close Date in Salesforce user timezone; fields and relationships correct. |
| 11. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 12. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 13. Activate Contract and confirm; open fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months. | Activated; 12 months; same Account; Activated By = Sales Manager; Activated Date populated. |
| 14. Clear browser state; open new Service JWT session; open and close profile menu. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months. | Visible profile name E2E Service Manager; new Service session active. |
| 15. Open fresh Details of the same Contract as Service Manager. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months. | Activated, owned Account and Description marker readable; Edit and Delete button counts zero. |
| 16. After successful Service checks, open new Sales JWT session, verify profile and open fresh Opportunity Details; on failure, defer Sales restoration until evidence capture in fixture teardown. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months. | E2E Sales Manager active; owned Opportunity Closed Won with 100%; records remain permanently. |
| 17. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-AI-001

**Objective:** AI Opportunity editing

**Source:** [tests/agent/sales.e2e.ts](../tests/agent/sales.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New unique name; Amount = 543.21.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Ask AI to enter the new Opportunity name and amount without saving. Save through the page object and wait for the dialog to close. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New unique name; Amount = 543.21. | Dialog closes; agent operates through UI only. |
| 7. Run deterministic fresh Details assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New unique name; Amount = 543.21. | New name and 543.21; all other fields, Account link and Sales ownership correct. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-AI-002

**Objective:** AI Contract editing and assertion

**Source:** [tests/agent/sales.e2e.ts](../tests/agent/sales.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. 24 months; unique Terms.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Ask AI to enter 24 months and the new Contract terms without saving. Save through the page object and wait for the dialog to close. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. 24 months; unique Terms. | Dialog closes. |
| 7. Run deterministic fresh Details assertions and agent.assert. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. 24 months; unique Terms. | 24 months, exact Terms and Draft; AI also confirms visible Draft and 24 months. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-AI-003

**Objective:** AI Quote acceptance and extraction

**Source:** [tests/agent/sales.e2e.ts](../tests/agent/sales.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Ask AI to select Accepted without saving. Save through the page object and wait for the dialog to close. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Dialog closes; deterministic fresh Details show Accepted. |
| 9. agent.extract reads visible Name, Status and Opportunity Name using a Zod schema. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Structured object contains exactly owned Quote name, Accepted and owned Opportunity name. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-AUTH

**Objective:** E2E Sales Manager JWT → Lightning session setup

**Source:** [tests/auth.setup.e2e.ts](../tests/auth.setup.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** ECA Web scope, JWT enabled, user preauthorization assigned; no interactive email code required.

**Test data:** Private JWT key, preauthorized client and role user; secrets excluded from design and public report.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Start role-specific JWT / singleaccess authentication; follow the real Got it UI link if a future maintenance notice appears. | JWT role E2E Sales Manager; configured client and RSA key; OTP/checksum values withheld. | Native Lightning login completes without interactive code; tokens and nested redirect session parameters redacted. |
| 2. Verify Opportunity list and View profile. | Role E2E Sales Manager; /lightning/o/Opportunity/list; View profile. | Search this list visible; New visible; profile name exactly E2E Sales Manager. |
| 3. Capture a redacted persona-verification PNG. | Authenticated E2E Sales Manager Lightning page. | Successful Allure setup has a PNG attachment; authentication secrets remain redacted. |
| 4. session.save('salesforce'). | Session name: salesforce; authenticated browser storage. | Authenticated session can be saved; no business data changed. |

## SF-AUTH-SERVICE

**Objective:** E2E Service Manager JWT → Lightning session setup

**Source:** [tests/auth.setup.e2e.ts](../tests/auth.setup.e2e.ts)

**Role:** E2E Service Manager

**Preconditions:** ECA Web scope, JWT enabled, user preauthorization assigned; no interactive email code required.

**Test data:** Private JWT key, preauthorized client and role user; secrets excluded from design and public report.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Start role-specific JWT / singleaccess authentication; follow the real Got it UI link if a future maintenance notice appears. | JWT role E2E Service Manager; configured client and RSA key; OTP/checksum values withheld. | Native Lightning login completes without interactive code; tokens and nested redirect session parameters redacted. |
| 2. Verify Opportunity list and View profile. | Role E2E Service Manager; /lightning/o/Opportunity/list; View profile. | Search this list visible; profile name exactly E2E Service Manager. |
| 3. Capture a redacted persona-verification PNG. | Authenticated E2E Service Manager Lightning page. | Successful Allure setup has a PNG attachment; authentication secrets remain redacted. |
| 4. session.save('service'). | Session name: service; authenticated browser storage. | Authenticated session can be saved; no business data changed. |

## SF-OPP-014

**Objective:** Persist a past Close Date on an open Opportunity

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Close Date = UTC today -7 days; Prospecting; Amount = 12345.67 USD.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Create an Opportunity under the owned Account with Close Date seven days in the past; Save. | Generated Opportunity name; owned Account ID; UTC date -7 days; Prospecting; 12345.67 USD; default description. | The dialog closes; the owned Opportunity ID is known. |
| 5. Open fresh Details and verify the complete Opportunity. | Owned Opportunity ID; date -7 days; original Amount 12345.67 USD and Prospecting. | The exact past date persists; all fields, Account link and Sales Owner/Created By are correct. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-015

**Objective:** Move an open Opportunity backwards through stages

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Negotiation/Review → Proposal/Price Quote → Qualification.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Stage = Negotiation/Review; Save and open fresh Details. | Owned Opportunity ID; target Stage Negotiation/Review; original Amount 12345.67 USD. | Stage = Negotiation/Review; original fields, Account relationship and Sales ownership persist. |
| 7. Edit Stage = Proposal/Price Quote; Save and open fresh Details. | Owned Opportunity ID; target Stage Proposal/Price Quote; original Amount 12345.67 USD. | Stage = Proposal/Price Quote; original fields, Account relationship and Sales ownership persist. |
| 8. Edit Stage = Qualification; Save and open fresh Details. | Owned Opportunity ID; target Stage Qualification; original Amount 12345.67 USD. | Stage = Qualification; original fields, Account relationship and Sales ownership persist. |
| 9. Verify final Qualification probability. | Qualification; configured Lost 0% and Won 100% boundaries. | Probability remains strictly between the configured Lost and Won probabilities. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-016

**Objective:** Persist a seven-digit amount with cents

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount = 1000000.99 USD.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Create the Opportunity with a seven-digit amount and cents; Save. | Amount 1000000.99 USD; Prospecting; UTC date +30 days; owned Account ID; generated name. | The form closes; the owned record URL is visible. |
| 5. Open fresh Details and verify all Opportunity fields. | Owned Opportunity ID; expected visible USD amount $1,000,000.99. | Amount is exactly 1000000.99 to two decimal places; other fields, links and Sales ownership are correct. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-017

**Objective:** Edit a grouped decimal amount back to zero

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount 12345.67 → 1000000.99 → 0 USD.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Amount to 1000000.99; Save and verify fresh Details. | Amount 1000000.99 USD; original name/date/Stage/description/Account. | The grouped decimal amount persists; other Opportunity fields and relationships are unchanged. |
| 7. Edit Amount to zero; Save and verify fresh Details. | Amount 0 USD; original name/date/Stage/description/Account. | Amount is 0.00 USD rather than empty; other fields and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-010

**Objective:** Edit Contract Start Date

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date = UTC today +7 days; term 12.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Contract Start Date; Save. | Owned Draft Contract ID; UTC date +7 days. | The dialog closes. |
| 7. Open fresh Details. | Expected date +7 days; term 12; owned Account name and Description marker. | New Start Date, 12 months, owned Account, Draft status and exact Description marker persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-011

**Objective:** Persist a one-month Draft Contract

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term = 1 month; UTC current Start Date.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Create Contract under the owned Account with one-month term; Save. | Owned Account ID; UTC current Start Date; term 1; unique Description marker and Unicode Special Terms. | The form closes; owned Contract ID and Contract Number are known. |
| 5. Open fresh Details. | ContractTerm 1; Status Draft; owned Account name. | Term is 1; Draft status and owned Account persist; the creation helper also verifies fields and Sales creator. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-012

**Objective:** Cancel Contract activation

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Draft Contract; term 12.

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

## SF-CON-013

**Objective:** Cancel Draft Contract deletion

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Open the Contract Delete dialog. | Owned Draft Contract ID and Contract Number. | The Delete confirmation is visible. |
| 7. Cancel and open fresh Details. | Cancel; expected Status Draft, term 12, owned Account name and marker. | Draft, 12 months, owned Account and exact Description marker persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-010

**Objective:** Deny a Quote without changing its Opportunity

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Status = Denied; Opportunity remains Prospecting.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Quote Status to Denied; Save. | Owned Quote ID; Status Denied. | The dialog closes. |
| 9. Verify fresh Quote Details, exact Opportunity link and full Opportunity Details. | Owned Quote name and ID; owned Opportunity ID; original Stage Prospecting and Amount 12345.67 USD. | Quote is Denied with the same name/Opportunity; original Opportunity fields and Sales ownership persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-011

**Objective:** Persist a past Quote expiration date

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiration Date = UTC today -1 day.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Expiration Date to yesterday; Save. | Owned Draft Quote ID; UTC date -1 day. | The dialog closes. |
| 9. Open fresh Details and verify the exact Opportunity link. | Expected date -1 day; Status Draft; owned Quote name and Opportunity ID. | Exact past expiry, original Quote name, Draft status and owned Opportunity persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-012

**Objective:** Reset Quote tax and shipping to zero

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax/Shipping 12.34/5.67 → 0/0; GrandTotal 18.01 → 0.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax and Shipping and Handling; Save and open fresh Details. | Tax 12.34 USD; shipping 5.67 USD; Quote has no product lines. | Tax = 12.34; ShippingHandling = 5.67; GrandTotal = 18.01; name and Draft persist. |
| 9. Edit both charges to zero; Save and open fresh Details. | Tax 0 USD; shipping 0 USD; GrandTotal 0 USD. | Tax, ShippingHandling and GrandTotal are all zero; original name and Draft status persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-013

**Objective:** Isolate two Quotes under one Opportunity

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Primary Quote Denied; Alternative Quote Draft → Presented.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 9. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 10. Edit the first Quote to Denied; Save; read both Quotes and exact Opportunity links. | Two distinct generated Quote names/IDs; same owned Opportunity ID; first Status Denied, second Draft. | First Quote is Denied; second remains Draft; each exact name/ID points to the same owned Opportunity. |
| 11. Edit the second Quote to Presented; Save; reread both and the complete Opportunity. | Second Status Presented; first Denied; original Opportunity Amount 12345.67 USD and Stage Prospecting. | Second Quote is Presented; first remains Denied; original Opportunity data and Sales ownership persist. |
| 12. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-E2E-002

**Objective:** Complete product sale through Contract and Service handoff

**Source:** [tests/integration.e2e.ts](../tests/integration.e2e.ts)

**Role:** E2E Sales Manager → E2E Service Manager → E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Product 125.50 USD ×2; Quote Presented → Accepted; sync on/off; Opportunity Won; Contract 24 months; Service read-only.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager → E2E Service Manager → E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Create an owned active Product and standard price through UI. | Unique Product name/code; Active; unit price 125.50 USD. | The Product and price saves complete; owned Product ID is known. |
| 3. Create an owned active custom Price Book and add that exact Product. | Owned Price Book name/ID; owned Product ID; Active. | Price Book Entries (1); exact Product row and 125.50 USD visible. |
| 4. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 5. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 6. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 7. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 8. Set Opportunity Stage = Qualification; Save and verify fresh Details. | Owned Opportunity ID; Stage Qualification. | Stage, fields, relationships and Sales ownership are correct. |
| 9. Set Opportunity Stage = Proposal/Price Quote; Save and verify fresh Details. | Owned Opportunity ID; Stage Proposal/Price Quote. | Stage, fields, relationships and Sales ownership are correct. |
| 10. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 11. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 12. Add the owned Product to the Quote with quantity two; Save. | Owned Product/Price Book IDs; unit price 125.50; quantity 2. | Line quantity 2.00; Subtotal, TotalPrice and GrandTotal = 251.00; exact Product link visible. |
| 13. Set Quote Status = Presented; Save; verify Details and exact Opportunity link. | Owned Quote ID; Status Presented; total 251.00 USD. | Status Presented; owned name/Account/Opportunity; all totals 251.00. |
| 14. Set Quote Status = Accepted; Save; verify Details and exact Opportunity link. | Owned Quote ID; Status Accepted; total 251.00 USD. | Status Accepted; owned name/Account/Opportunity; all totals 251.00. |
| 15. Start Sync and confirm Continue; read the Opportunity. | Accepted Quote ID; owned Opportunity ID; expected amount 251.00 USD. | Syncing true; Opportunity Amount = 251.00; other fields and Sales ownership persist. |
| 16. Stop Sync and confirm Continue; read the Opportunity. | Same Quote/Opportunity IDs; expected amount 251.00 USD. | Syncing false; Opportunity Amount remains 251.00. |
| 17. Set Opportunity Negotiation/Review, then Closed Won; save and verify each stage. | Stage Negotiation/Review → Closed Won; configured Won probability and SF_TIME_ZONE. | Closed Won, configured 100% probability, user-timezone current Close Date and amount 251.00. |
| 18. Create a 24-month Contract under the same Account; Save and verify Details. | Owned Account ID; UTC current Start Date; term 24; unique marker; Unicode default terms. | Draft; same Account; term 24; owned marker, dates and Sales creator verified. |
| 19. Edit Special Terms; Save; Activate and confirm. | Special Terms: Agreed delivery in 30 days; service SLA 8 hours. | Activated; term 24; exact agreed terms; activating Sales user and nonempty activation date. |
| 20. Clear state; open fresh Service JWT session and verify profile. | Service role; preauthorized client/key, values withheld. | Visible profile is E2E Service Manager. |
| 21. Read the same activated Contract as Service. | Owned Contract ID; expected 24 months and agreed terms. | Same Account, Activated, term 24, exact terms and marker; Edit/Delete absent. |
| 22. Restore Sales with fresh JWT after successful Service checks and verify profile; on failure, defer restoration until evidence capture in fixture teardown. | Sales role; preauthorized client/key, values withheld. | E2E Sales Manager is active; records remain permanently and evidence is captured. |
| 23. Reread Opportunity, Quote and Contract through fresh Details. | The exact owned Opportunity, Quote, Contract and Account IDs. | Won/100%/251.00; Quote Accepted/not syncing/251.00; Contract Activated/24 months/exact terms. |
| 24. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-E2E-003

**Objective:** Recover a lost sale and replace a denied Quote

**Source:** [tests/integration.e2e.ts](../tests/integration.e2e.ts)

**Role:** E2E Sales Manager → E2E Service Manager → E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Lost → Qualification → Proposal → Negotiation; Denied and revised Accepted Quotes; charges 12.34+5.67=18.01; Won; revised 24-month Activated Contract; Service handoff.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager → E2E Service Manager → E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Set Opportunity Closed Lost; Save and verify Details. | Owned Opportunity ID; Closed Lost; configured Lost probability. | Closed Lost; Probability 0%; original owned fields persist. |
| 7. Set Opportunity Stage = Qualification; Save and verify fresh Details. | Owned Opportunity ID; target Qualification. | Stage Qualification; original fields, links and Sales ownership persist. |
| 8. Set Opportunity Stage = Proposal/Price Quote; Save and verify fresh Details. | Owned Opportunity ID; target Proposal/Price Quote. | Stage Proposal/Price Quote; original fields, links and Sales ownership persist. |
| 9. Set Opportunity Stage = Negotiation/Review; Save and verify fresh Details. | Owned Opportunity ID; target Negotiation/Review. | Stage Negotiation/Review; original fields, links and Sales ownership persist. |
| 10. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 11. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 12. Set the initial proposal Quote to Denied; Save and verify. | Unique DeniedProposal name/ID; Status Denied. | Exact initial Quote is Denied and remains linked to the owned Opportunity. |
| 13. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 14. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 15. Edit the revised Quote charges and select Presented; Save and verify. | RevisedProposal ID; Tax 12.34; shipping 5.67; Status Presented. | Presented; Tax 12.34; ShippingHandling 5.67; GrandTotal 18.01. |
| 16. Set revised Quote Accepted; Save; verify Details and exact Opportunity link. | Revised Quote ID; Accepted; GrandTotal 18.01 USD. | Accepted; same owned Account/Opportunity; total 18.01. |
| 17. Reread the initial Quote. | Initial Quote ID; expected Denied and original owned Opportunity. | Initial proposal remains Denied; changing the alternative did not change it. |
| 18. Edit Opportunity Amount to the accepted total; Save and verify. | Amount 18.01 USD; owned Opportunity ID. | Amount 18.01; other fields and Sales ownership correct. |
| 19. Set Opportunity Closed Won; Save and verify. | Closed Won; configured Won probability; SF_TIME_ZONE. | Won, configured 100%, user-timezone current Close Date and amount 18.01. |
| 20. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 21. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 22. Edit Contract term and Special Terms; Save and verify Draft. | Term 24; unique E2E-TA-RevisedServiceTerms value. | Term 24; exact new terms; Draft and same Account. |
| 23. Activate Contract and confirm; read Details. | Owned Contract ID; same Account; term 24 and revised terms. | Activated; term 24; exact revised terms; activating Sales user/date. |
| 24. Clear state; open fresh Service JWT session and verify profile. | Service role; preauthorized client/key, values withheld. | Visible profile E2E Service Manager. |
| 25. Read the same Contract as Service. | Owned Contract ID, Account name, revised terms and marker. | Activated; term 24; exact Account, terms and marker; Edit/Delete absent. |
| 26. Restore Sales with fresh JWT after successful Service checks and verify profile; on failure, defer restoration until evidence capture in fixture teardown. | Sales role; preauthorized client/key, values withheld. | Sales Manager active; records remain permanently. |
| 27. Reread the Opportunity and both Quotes. | Owned Opportunity and distinct initial/revised Quote IDs. | Opportunity Won/100%/18.01; revised Quote Accepted/18.01; initial Quote Denied; exact relationships persist. |
| 28. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-018

**Objective:** Persist empty Opportunity description

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "".

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Description and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "". | Dialog closes; other fields unchanged. |
| 7. Read fresh Details with full Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "". | Exact description including line breaks; all original fields, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-019

**Objective:** Persist multiline Unicode Opportunity description

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "First line: áéőű\nSecond line: delivery & support.".

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Description and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "First line: áéőű\nSecond line: delivery & support.". | Dialog closes; other fields unchanged. |
| 7. Read fresh Details with full Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "First line: áéőű\nSecond line: delivery & support.". | Exact description including line breaks; all original fields, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-020

**Objective:** Edit Opportunity Amount to a small decimal

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount 12345.67 → 42.42 USD.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Amount to 42.42 and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount 12345.67 → 42.42 USD. | Dialog closes. |
| 7. Read fresh Details with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Amount 12345.67 → 42.42 USD. | 42.42 USD; other fields, Account and ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-021

**Objective:** Persist Opportunity Close Date today

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. UTC Close Date +0 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Create Opportunity with the specified Close Date and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. UTC Close Date +0 days. | Record URL contains the saved Opportunity ID. |
| 5. Read fresh Details with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. UTC Close Date +0 days. | Exact date; Prospecting, original amount, description, Account and Sales ownership persist. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-022

**Objective:** Persist Opportunity Close Date one year ahead

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. UTC Close Date +365 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Create Opportunity with the specified Close Date and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. UTC Close Date +365 days. | Record URL contains the saved Opportunity ID. |
| 5. Read fresh Details with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. UTC Close Date +365 days. | Exact date; Prospecting, original amount, description, Account and Sales ownership persist. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-023

**Objective:** Persist manually entered probability

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability = 37%.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Probability (%) to 37 and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability = 37%. | Dialog closes. |
| 7. Read fresh Details with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability = 37%. | Probability 37%; original Stage, fields, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-024

**Objective:** Persist Unicode Next Step

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Next Step = Árajánlat egyeztetés & follow-up.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Next Step and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Next Step = Árajánlat egyeztetés & follow-up. | Dialog closes. |
| 7. Read fresh Details with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Next Step = Árajánlat egyeztetés & follow-up. | Exact Unicode Next Step; original fields and relationships persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-014

**Objective:** Recalculate Quote total with tax 12.34 and shipping 0

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 12.34; shipping 0; no line items.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax and Shipping and Handling and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 12.34; shipping 0; no line items. | Dialog closes. |
| 9. Read fresh Quote Details and exact Opportunity link; reread full Opportunity. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 12.34; shipping 0; no line items. | Tax 12.34; shipping 0; Subtotal/TotalPrice zero; GrandTotal 12.34; Draft and name persist; parent unchanged. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-015

**Objective:** Recalculate Quote total with tax 0 and shipping 5.67

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 0; shipping 5.67; no line items.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax and Shipping and Handling and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 0; shipping 5.67; no line items. | Dialog closes. |
| 9. Read fresh Quote Details and exact Opportunity link; reread full Opportunity. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 0; shipping 5.67; no line items. | Tax 0; shipping 5.67; Subtotal/TotalPrice zero; GrandTotal 5.67; Draft and name persist; parent unchanged. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-016

**Objective:** Recalculate Quote total with tax 1000000.99 and shipping 12345.67

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 1000000.99; shipping 12345.67; no line items.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax and Shipping and Handling and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 1000000.99; shipping 12345.67; no line items. | Dialog closes. |
| 9. Read fresh Quote Details and exact Opportunity link; reread full Opportunity. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 1000000.99; shipping 12345.67; no line items. | Tax 1000000.99; shipping 12345.67; Subtotal/TotalPrice zero; GrandTotal 1012346.66; Draft and name persist; parent unchanged. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-017

**Objective:** Recalculate Quote total with tax 0.01 and shipping 0.01

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 0.01; shipping 0.01; no line items.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax and Shipping and Handling and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 0.01; shipping 0.01; no line items. | Dialog closes. |
| 9. Read fresh Quote Details and exact Opportunity link; reread full Opportunity. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tax 0.01; shipping 0.01; no line items. | Tax 0.01; shipping 0.01; Subtotal/TotalPrice zero; GrandTotal 0.02; Draft and name persist; parent unchanged. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-018

**Objective:** Persist Quote expiration today

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiration Date = UTC today.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Expiration Date to today and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiration Date = UTC today. | Dialog closes. |
| 9. Read fresh Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiration Date = UTC today. | Exact current date; original name, Draft and Opportunity relationship persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-019

**Objective:** Persist empty Quote description

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "".

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Description and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "". | Dialog closes. |
| 9. Read fresh Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "". | Exact description including line breaks; original name, Draft and relationship persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-020

**Objective:** Persist multiline Unicode Quote description

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "Quote first line: áéőű\nSecond line: service & delivery.".

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Description and Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "Quote first line: áéőű\nSecond line: service & delivery.". | Dialog closes. |
| 9. Read fresh Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Description = "Quote first line: áéőű\nSecond line: service & delivery.". | Exact description including line breaks; original name, Draft and relationship persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-021

**Objective:** Return Accepted Quote to Draft

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Status to Accepted and Save; read fresh Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Status Accepted; original name and exact parent persist. |
| 9. Edit Status to Draft and Save; read fresh Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Status Draft; original name and exact parent persist. |
| 10. Read the full parent Opportunity. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. | Original fields, Account and Sales ownership persist. |
| 11. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-025

**Objective:** Clear a saved Unicode Next Step

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Next Step: Árajánlat egyeztetés & follow-up → empty.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Next Step to the Unicode text; Save and read fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Next Step: Árajánlat egyeztetés & follow-up → empty. | Exact text persists; full original Opportunity fields, Account and Sales ownership verified. |
| 7. Edit Next Step to empty; Save and read fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Next Step: Árajánlat egyeztetés & follow-up → empty. | Next Step is empty; original fields and relationships persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-026

**Objective:** Cancel a manual probability change

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Probability 73%.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Read the original Probability from fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Probability 73%. | Original probability captured with full Opportunity assertions. |
| 7. Edit Probability (%) to 73; Cancel; read fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Probability 73%. | Original probability, all fields, exact Account link and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-027

**Objective:** Persist 0% probability on an open Opportunity

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability 0%; Stage Prospecting.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Probability (%) to 0; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability 0%; Stage Prospecting. | Dialog closes. |
| 7. Read fresh Details with full Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability 0%; Stage Prospecting. | Probability 0%; Stage remains Prospecting; original fields, exact Account link and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-028

**Objective:** Persist 100% probability on an open Opportunity

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability 100%; Stage Prospecting.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Probability (%) to 100; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability 100%; Stage Prospecting. | Dialog closes. |
| 7. Read fresh Details with full Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Probability 100%; Stage Prospecting. | Probability 100%; Stage remains Prospecting; original fields, exact Account link and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-029

**Objective:** Cancel a Close Date change

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Original UTC +30 days; unsaved UTC +90 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Close Date to UTC +90 days; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Original UTC +30 days; unsaved UTC +90 days. | Dialog closes without saving. |
| 7. Read fresh Details with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Original UTC +30 days; unsaved UTC +90 days. | Original +30-day Close Date, fields, Account link and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-030

**Objective:** Edit an open Opportunity Close Date into the past

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Close Date UTC -30 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Close Date to UTC -30 days; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Close Date UTC -30 days. | Dialog closes. |
| 7. Read fresh Details with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Close Date UTC -30 days. | Exact past Close Date; Stage Prospecting; original amount, description, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-031

**Objective:** Persist Order Number

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Order Number = ORD-ÁR01. Exact configured UI maximum: 8 characters.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Order Number to the specified value; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Order Number = ORD-ÁR01. Exact configured UI maximum: 8 characters. | Dialog closes; entered value verified before Save. |
| 7. Read fresh Details with full Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Order Number = ORD-ÁR01. Exact configured UI maximum: 8 characters. | Exact Order Number value; original fields, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-032

**Objective:** Persist Main Competitor(s)

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Main Competitor(s) = Versenytárs őű & partner. Unicode text.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Edit Main Competitor(s) to the specified value; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Main Competitor(s) = Versenytárs őű & partner. Unicode text. | Dialog closes; entered value verified before Save. |
| 7. Read fresh Details with full Opportunity assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Main Competitor(s) = Versenytárs őű & partner. Unicode text. | Exact Main Competitor(s) value; original fields, Account and Sales ownership persist. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-OPP-033

**Objective:** Persist Tracking Number

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Tracking Number = TRACK-100-A1. Exact configured UI maximum: 12 characters.

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

## SF-OPP-034

**Objective:** Isolate edits between Opportunities sharing an Account

**Source:** [tests/opportunity.e2e.ts](../tests/opportunity.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two distinct Opportunity IDs under one Account; first Amount 456.78, UTC Close Date +75 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 7. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 8. Edit only the first Opportunity amount and Close Date; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two distinct Opportunity IDs under one Account; first Amount 456.78, UTC Close Date +75 days. | Dialog closes; Opportunity IDs are distinct. |
| 9. Read both Opportunities with full assertions and exact Account links. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two distinct Opportunity IDs under one Account; first Amount 456.78, UTC Close Date +75 days. | First has 456.78 and +75-day date; second retains 12345.67 and +30-day date; both original names, descriptions, stages and Sales ownership persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-014

**Objective:** Create a thirty-six-month Draft Contract

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 36 months; UTC current Start Date; Unicode default Special Terms.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with owned Account, current UTC Start Date, 36 months, unique Description marker and Unicode Special Terms; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 36 months; UTC current Start Date; Unicode default Special Terms. | Form closes; exact Contract ID resolved and Contract Number retained. |
| 5. Read fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 36 months; UTC current Start Date; Unicode default Special Terms. | Draft; term 36; exact Account, date, marker and Special Terms; Created By E2E Sales Manager. |
| 6. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-015

**Objective:** Edit a Draft Contract term to 1 months

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 12 → 1 months.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Contract Term (months) to 1; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 12 → 1 months. | Dialog closes. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 12 → 1 months. | Term 1; original Start Date, Unicode Special Terms, Account and owned Description marker; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-016

**Objective:** Edit a Draft Contract term to 36 months

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 12 → 36 months.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Contract Term (months) to 36; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 12 → 36 months. | Dialog closes. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Term 12 → 36 months. | Term 36; original Start Date, Unicode Special Terms, Account and owned Description marker; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-017

**Objective:** Persist empty Special Terms

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Special Terms = "".

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Special Terms to the specified value; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Special Terms = "". | Dialog closes. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Special Terms = "". | Exact Special Terms including line breaks/empty value; original term 12, Start Date, Account and Description marker; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-018

**Objective:** Persist multiline Unicode Special Terms

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Special Terms = "Első sor: őű & feltételek.\nSecond line: delivery in 30 days.".

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Special Terms to the specified value; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Special Terms = "Első sor: őű & feltételek.\nSecond line: delivery in 30 days.". | Dialog closes. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Special Terms = "Első sor: őű & feltételek.\nSecond line: delivery in 30 days.". | Exact Special Terms including line breaks/empty value; original term 12, Start Date, Account and Description marker; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-019

**Objective:** Cancel Special Terms editing

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved: Unsaved terms: áéőű & clauses.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Special Terms to the unsaved text; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved: Unsaved terms: áéőű & clauses. | Dialog closes. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved: Unsaved terms: áéőű & clauses. | Original Unicode Special Terms, term, Start Date, Account and owned marker; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-020

**Objective:** Edit Contract Start Date into the past

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date UTC -7 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Contract Start Date to UTC -7 days; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date UTC -7 days. | Dialog closes. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Start Date UTC -7 days. | Exact past date; original term, Special Terms, Account and marker; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-021

**Objective:** Cancel Contract Start Date editing

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Start Date UTC +30 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Contract Start Date to UTC +30 days; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Start Date UTC +30 days. | Dialog closes. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Start Date UTC +30 days. | Original UTC current Start Date, term, Special Terms, Account and marker; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-022

**Objective:** Isolate two Draft Contracts sharing an Account

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two distinct Contract IDs; first term 24 and Special Terms First Contract only: őű & 24 months.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 7. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 8. Edit only the first Contract term and Special Terms; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two distinct Contract IDs; first term 24 and Special Terms First Contract only: őű & 24 months. | Dialog closes; Contract IDs are distinct. |
| 9. Read both fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two distinct Contract IDs; first term 24 and Special Terms First Contract only: őű & 24 months. | First term 24 and exact changed terms; second term 12 and original terms; each original date/marker and shared Account; both Draft. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-CON-023

**Objective:** Revise Contract Description ownership marker

**Source:** [tests/contract.e2e.ts](../tests/contract.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New unique E2E-TA-RevisedContractMarker value.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Save and completed fields are visible; the owned Account is prefilled. |
| 5. Save the Contract and open fresh Details. | Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms. | Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the retention journal. |
| 6. Edit Description to the new unique marker; Save; persist the new marker in the permanent journal. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New unique E2E-TA-RevisedContractMarker value. | Dialog closes; journal now matches the saved Description. |
| 7. Read fresh Contract Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. New unique E2E-TA-RevisedContractMarker value. | Exact revised marker; original term, date, Special Terms and Account; Draft persists. |
| 8. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-022

**Objective:** Persist Quote expiration one year ahead

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiration Date UTC +365 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Expiration Date to UTC +365 days; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiration Date UTC +365 days. | Dialog closes. |
| 9. Read fresh Quote Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Expiration Date UTC +365 days. | Exact expiry; original name, Draft, Opportunity and Account names; relationship targets owned Opportunity ID. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-023

**Objective:** Cancel Quote expiration editing

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Original expiry UTC +14; unsaved UTC +90 days.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Expiration Date to UTC +90 days; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Original expiry UTC +14; unsaved UTC +90 days. | Dialog closes. |
| 9. Read fresh Quote Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Original expiry UTC +14; unsaved UTC +90 days. | Original expiry, name, Draft and owned parent relationship persist. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-024

**Objective:** Cancel Quote tax and shipping editing

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Saved Tax 1.23, Shipping 4.56, GrandTotal 5.79; unsaved Tax 12.34, Shipping 5.67.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax to 1.23 and Shipping and Handling to 4.56; Save; read fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Saved Tax 1.23, Shipping 4.56, GrandTotal 5.79; unsaved Tax 12.34, Shipping 5.67. | Exact charges 1.23/4.56 and GrandTotal 5.79 persist. |
| 9. Read fresh Details and capture original Tax, ShippingHandling and GrandTotal. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Saved Tax 1.23, Shipping 4.56, GrandTotal 5.79; unsaved Tax 12.34, Shipping 5.67. | Original values captured from UI. |
| 10. Edit both charges to 12.34 and 5.67; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Saved Tax 1.23, Shipping 4.56, GrandTotal 5.79; unsaved Tax 12.34, Shipping 5.67. | Dialog closes. |
| 11. Read fresh Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Saved Tax 1.23, Shipping 4.56, GrandTotal 5.79; unsaved Tax 12.34, Shipping 5.67. | Original charges and GrandTotal; name, Draft and owned parent persist. |
| 12. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-025

**Objective:** Quote Presented → Denied without changing its Opportunity

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Statuses Presented → Denied.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Quote Status to Presented; Save; read fresh Quote Details, exact Opportunity link and full parent Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Statuses Presented → Denied. | Quote Presented; same name/parent; Opportunity fields, Account link and Sales ownership unchanged. |
| 9. Edit Quote Status to Denied; Save; read fresh Quote Details, exact Opportunity link and full parent Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Statuses Presented → Denied. | Quote Denied; same name/parent; Opportunity fields, Account link and Sales ownership unchanged. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-026

**Objective:** Quote Denied → Draft without changing its Opportunity

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Statuses Denied → Draft.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Quote Status to Denied; Save; read fresh Quote Details, exact Opportunity link and full parent Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Statuses Denied → Draft. | Quote Denied; same name/parent; Opportunity fields, Account link and Sales ownership unchanged. |
| 9. Edit Quote Status to Draft; Save; read fresh Quote Details, exact Opportunity link and full parent Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Statuses Denied → Draft. | Quote Draft; same name/parent; Opportunity fields, Account link and Sales ownership unchanged. |
| 10. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-027

**Objective:** Rename the same Quote twice

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two unique names: QuoteRevisionOne and QuoteRevisionTwo; same Quote ID.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Quote Name to a generated QuoteRevisionOne name; update journal; Save; read Details and parent link; search exact previous name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two unique names: QuoteRevisionOne and QuoteRevisionTwo; same Quote ID. | Exact new name, Draft, same parent ID; exact previous name absent, allowing asynchronously indexed row under new name. |
| 9. Edit Quote Name to a generated QuoteRevisionTwo name; update journal; Save; read Details and parent link; search exact previous name. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two unique names: QuoteRevisionOne and QuoteRevisionTwo; same Quote ID. | Exact new name, Draft, same parent ID; exact previous name absent, allowing asynchronously indexed row under new name. |
| 10. Read full parent Opportunity Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two unique names: QuoteRevisionOne and QuoteRevisionTwo; same Quote ID. | Original fields, Account and Sales ownership persist. |
| 11. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-028

**Objective:** Edit Tax while preserving the other charge

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 56.78/5.67; GrandTotal 62.45.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax 12.34 and Shipping 5.67; Save and read fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 56.78/5.67; GrandTotal 62.45. | Charges read back exactly; GrandTotal 18.01. |
| 9. Edit only Tax; Save; read fresh Details and exact parent link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 56.78/5.67; GrandTotal 62.45. | Tax 56.78; ShippingHandling 5.67; GrandTotal 62.45; Subtotal/TotalPrice zero; name, Draft and parent persist. |
| 10. Read full parent Opportunity Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 56.78/5.67; GrandTotal 62.45. | Original amount, fields, Account and Sales ownership persist. |
| 11. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-029

**Objective:** Edit Shipping and Handling while preserving the other charge

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 12.34/9.99; GrandTotal 22.33.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Edit Tax 12.34 and Shipping 5.67; Save and read fresh Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 12.34/9.99; GrandTotal 22.33. | Charges read back exactly; GrandTotal 18.01. |
| 9. Edit only Shipping and Handling; Save; read fresh Details and exact parent link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 12.34/9.99; GrandTotal 22.33. | Tax 12.34; ShippingHandling 9.99; GrandTotal 22.33; Subtotal/TotalPrice zero; name, Draft and parent persist. |
| 10. Read full parent Opportunity Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Initial Tax/Shipping 12.34/5.67; final 12.34/9.99; GrandTotal 22.33. | Original amount, fields, Account and Sales ownership persist. |
| 11. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-030

**Objective:** Cancel Quote Description editing

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Description = Unsaved őű & description.\nSecond line.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Save and entered fields are visible; the owned Opportunity is prefilled. |
| 7. Save the Quote and open fresh Details. | Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description. | Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager. |
| 8. Read the original Description from fresh Quote Details. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Description = Unsaved őű & description.\nSecond line. | Original description captured from UI. |
| 9. Edit Description to the unsaved multiline Unicode text; Cancel. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Description = Unsaved őű & description.\nSecond line. | Dialog closes. |
| 10. Read fresh Quote Details and exact Opportunity link. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Unsaved Description = Unsaved őű & description.\nSecond line. | Original Description, name, Draft and owned parent persist. |
| 11. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |

## SF-QUO-031

**Objective:** Isolate Quotes belonging to different Opportunities

**Source:** [tests/quote.e2e.ts](../tests/quote.e2e.ts)

**Role:** E2E Sales Manager

**Preconditions:** JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.

**Test data:** Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two Opportunities and two Quotes under one Account; first Quote Accepted with charges 12.34/5.67.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Restore the saved Lightning session for the assigned role. | Saved role session: E2E Sales Manager; configured JWT client and private key (values withheld). | JWT setup has verified the active user through UI; the user is not an administrator. |
| 2. Open New Account and enter a unique Account Name. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | Save and editable Account Name are visible; the entered value reads back correctly. |
| 3. Save the Account and open its record page. | Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save. | The form closes; the URL contains the Account ID; the exact Account name appears as a heading. |
| 4. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 5. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 6. Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Account Name and entered values are visible; Stage shows Prospecting. |
| 7. Save the Opportunity and open Details after fresh navigation. | Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity. | Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager. |
| 8. Create one Draft Quote under each distinct Opportunity through UI; Save and read each. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two Opportunities and two Quotes under one Account; first Quote Accepted with charges 12.34/5.67. | Each unique Quote name/ID, +14-day expiry and Unicode description; correct Account and its own Opportunity; Sales creator verified. |
| 9. Read the second Quote and capture its original Tax and Shipping and Handling UI values. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two Opportunities and two Quotes under one Account; first Quote Accepted with charges 12.34/5.67. | Original unset charges are visible as blank; GrandTotal is zero. Blank values are preserved, not assumed to be stored numeric zeros. |
| 10. Edit only the first Quote to Accepted, Tax 12.34 and Shipping 5.67; Save. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two Opportunities and two Quotes under one Account; first Quote Accepted with charges 12.34/5.67. | Dialog closes; parent and child IDs are distinct. |
| 11. Read both fresh Quote Details and exact parent links. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two Opportunities and two Quotes under one Account; first Quote Accepted with charges 12.34/5.67. | First Accepted/12.34/5.67/18.01; second Draft with its original blank Tax/Shipping and GrandTotal zero; exact original names and separate parent IDs. |
| 12. Read both parent Opportunities with full assertions. | Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture. Two Opportunities and two Quotes under one Account; first Quote Accepted with charges 12.34/5.67. | Both retain original fields, amount 12345.67, Prospecting, shared Account and Sales ownership. |
| 13. Preserve every created sandbox record; publish exact record links and capture a redacted completion PNG. | Exact saved record IDs and names; permanent .e2e-data journal; redacted PNG and retained-records.json in this attempt’s artifacts. | No records are deleted, including supporting Accounts, Contracts, Cases and catalogue data. Successful Allure results contain a PNG and links to every saved record; journals remain permanently. |
