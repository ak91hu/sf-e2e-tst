type ScenarioStep = readonly [action: string, expected: string, data?: string];
export type DesignStep = readonly [action: string, data: string, expected: string];
export interface TestDesign {
  id: string; title: string; file: string; persona: string; data: string;
  preconditions: string; steps: readonly DesignStep[];
}
const cases: TestDesign[] = [];
const sales = 'E2E Sales Manager';
const service = 'E2E Service Manager';
const auth: ScenarioStep = ['Restore the saved Lightning session for the assigned role.', 'JWT setup has verified the active user through UI; the user is not an administrator.'];
const account: ScenarioStep[] = [
  ['Open New Account and enter a unique Account Name.', 'Save and editable Account Name are visible; the entered value reads back correctly.'],
  ['Save the Account and open its record page.', 'The form closes; the URL contains the Account ID; the exact Account name appears as a heading.'],
];
const opportunity: ScenarioStep[] = [
  ['Open New Opportunity with the owned Account prefilled; enter name, Close Date +30 days, Prospecting, 12345.67 USD and description.', 'Account Name and entered values are visible; Stage shows Prospecting.'],
  ['Save the Opportunity and open Details after fresh navigation.', 'Name, amount, date, Stage and description match; the Account link targets the owned Account ID; Owner and Created By are E2E Sales Manager.'],
];
const contract: ScenarioStep[] = [
  ['Complete New Contract with the owned Account, UTC current Start Date, 12 months, unique Description marker and Unicode Special Terms.', 'Save and completed fields are visible; the owned Account is prefilled.'],
  ['Save the Contract and open fresh Details.', 'Draft; correct Account, Start Date, 12 months, Description and Special Terms; Created By is E2E Sales Manager; Contract Number enters the cleanup journal.'],
];
const quote: ScenarioStep[] = [
  ['Open New Quote for the owned Opportunity; enter unique Quote Name, expiry +14 days and Unicode description.', 'Save and entered fields are visible; the owned Opportunity is prefilled.'],
  ['Save the Quote and open fresh Details.', 'Draft; correct Quote Name, Opportunity Name, Account Name and Expiration Date; Created By is E2E Sales Manager.'],
];
const cleanup: ScenarioStep = ['Fixture teardown deletes only this case’s journaled records through UI in dependency order; discard unfinished forms.', 'The UI leaves each deleted record URL; exact-name search finds no record. Journal deleted becomes true only after proven deletion or absence. Failed cleanup retains the journal for targeted UI recovery.'];
const add = (id: string, title: string, file: string, data: string, steps: ScenarioStep[], persona = sales, fixture: 'account' | 'opportunity' | 'contract' | 'quote' | 'none' = 'none') => {
  const setup = fixture === 'none' ? [] : [...account, ...(fixture === 'opportunity' || fixture === 'quote' ? opportunity : []), ...(fixture === 'contract' ? contract : []), ...(fixture === 'quote' ? quote : [])];
  cases.push({ id, title, file: `tests/${file}.e2e.ts`, persona, data,
    preconditions: 'JWT Web scope and role permissions configured; Salesforce Lightning, en_US UI, Europe/Budapest user timezone; one worker and isolated owned data. Standard Quote enabled; object UI permissions follow the assigned role.',
    steps: [auth, ...setup, ...steps, cleanup].map(step => [step[0], step[2] ?? (step === auth ? `Saved role session: ${persona}; configured JWT client and private key (values withheld).` : step === cleanup ? 'This case’s exact owned record IDs, names and Description markers in .e2e-data; order: Quote, Contract, Opportunity, Case, Price Book, Product, Account.' : account.includes(step) ? 'Account Name = generated E2E-TA- name (timestamp + UUID); owned Account ID after Save.' : opportunity.includes(step) ? 'Owned Account ID; generated Opportunity name; Amount 12345.67 USD; UTC date +30 days; Stage Prospecting; Unicode description; Sales Manager identity.' : contract.includes(step) ? 'Owned Account ID; UTC current Start Date; term 12 months; unique Description marker; Unicode Special Terms.' : quote.includes(step) ? 'Owned Opportunity ID and Account; generated Quote name; UTC expiry +14 days; Unicode description.' : data), step[1]] as DesignStep) });
};
const draftData = 'Unique E2E-TA- name (timestamp + UUID); every Account and business record belongs to this case’s fixture.';
add('SF-AUTH-001', 'Authenticated Opportunity list is accessible', 'auth', 'Saved Sales session; no business data.', [
  ['Open the Opportunity list view.', 'URL is /lightning/o/Opportunity/list; New is visible.'],
]);
add('SF-OPP-001', 'Complete Opportunity sales lifecycle', 'opportunity', `${draftData} Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won.`, [
  ...['Qualification', 'Proposal/Price Quote', 'Negotiation/Review'].map(stage => [`Open Edit, select Stage = ${stage}, Save and open fresh Details.`, `Stage = ${stage}; name, amount, description, Account and Sales Owner/Created By remain correct.`] as ScenarioStep),
  ['Set Stage = Closed Won; Save and open fresh Details.', 'Closed Won; Probability = 100%. Salesforce changes future Close Date to the user’s current date; the Budapest date immediately before or after Save is accepted across midnight.'],
], sales, 'opportunity');
for (const [id, field] of [['002', 'Opportunity Name'], ['003', 'Close Date'], ['004', 'Stage']]) add(`SF-OPP-${id}`, `Required field: ${field}`, 'opportunity', `${draftData} Empty/--None--: ${field}; other required fields valid.`, [
  ['Prepare the Opportunity form, leaving only the tested required field empty or --None--.', 'Owned Account prefilled; other fields completed; no Opportunity ID before Save.'],
  ['Press Save.', `${field} has aria-invalid = true; creation dialog remains open.`],
  ['Cancel and search for the exact owned Opportunity name.', 'The dialog closes; no matching record exists.'],
], sales, 'account');
add('SF-OPP-005', 'Cancel Opportunity creation', 'opportunity', draftData, [
  ['Prepare a complete Opportunity form with valid defaults.', 'Entered name, amount, date and Stage verified; record not saved.'],
  ['Cancel and search for the exact name in the Opportunity list.', 'The dialog closes; no matching record exists.'],
], sales, 'account');
add('SF-OPP-006', 'Edit Opportunity name, amount, date and Unicode description', 'opportunity', `${draftData} New name; 98765.43 USD; +60 days; “Unicode áéíóöőúüű & symbols.”`, [
  ['Open Edit; enter new name, amount, Close Date and description; Save.', 'The form closes; journal records the new name before saving.'],
  ['Verify fresh Details and the Account link.', 'New name, 98765.43, +60-day date and complete Unicode description read back correctly; Stage, Account and Sales Owner/Created By correct.'],
  ['Search for the exact previous name.', 'No exact link uses the previous name; asynchronous indexing may temporarily return the renamed row under its new name.'],
], sales, 'opportunity');
add('SF-OPP-007', 'Cancel Opportunity editing', 'opportunity', `${draftData} Unsaved name; Amount = 1.`, [
  ['Open Edit; enter a new name and Amount = 1; Cancel.', 'The dialog closes.'],
  ['Open fresh Details and run complete Opportunity assertions.', 'Original name, 12345.67 USD, date, Stage, description and Account persist; Sales Owner/Created By correct.'],
], sales, 'opportunity');
add('SF-OPP-008', 'Closed Lost and automatic probability', 'opportunity', `${draftData} Closed Lost; 0%.`, [
  ['Open Edit; set Stage = Closed Lost; Save and open fresh Details.', 'Closed Lost and 0% Probability; original Close Date, amount and relationships persist.'],
], sales, 'opportunity');
add('SF-OPP-009', 'Reopen Closed Lost', 'opportunity', `${draftData} Closed Lost → Qualification.`, [
  ['Set Stage = Closed Lost; Save and open fresh Details.', 'Closed Lost; Probability = 0%.'],
  ['Set Stage = Qualification; Save and open fresh Details.', 'Qualification; 0% < Probability < 100%; record fields, Account and Sales ownership persist.'],
], sales, 'opportunity');
add('SF-OPP-010', 'Cancel Opportunity deletion', 'opportunity', draftData, [
  ['Open the Delete action.', 'Delete confirmation dialog and Delete button visible.'],
  ['Cancel and open fresh Details.', 'All original record fields and relationships persist.'],
], sales, 'opportunity');
add('SF-OPP-011', 'Confirm Opportunity deletion through UI', 'opportunity', draftData, [
  ['Open Delete and confirm Delete.', 'The dialog closes; Salesforce leaves the deleted record URL.'],
  ['Search for the exact name in the Opportunity list.', 'No exact match; only then does the owned journal set deleted = true.'],
], sales, 'opportunity');
for (const [id, amount] of [['012', '0'], ['013', '0.01']]) add(`SF-OPP-${id}`, `Persist Opportunity amount: ${amount}`, 'opportunity', `${draftData} Amount = ${amount} USD.`, [
  [`Create an Opportunity with amount ${amount} under the owned Account; Save.`, 'The dialog closes; URL contains the owned Opportunity ID.'],
  ['Open fresh Details and run complete Opportunity assertions.', `Amount = ${amount} to two decimal places; name, date, Prospecting, description, Account link and Sales Owner/Created By correct.`],
], sales, 'account');
add('SF-CON-001', 'Create Draft Contract', 'contract', `${draftData} Start Date = UTC today; term = 12; Unicode terms.`, [], sales, 'contract');
for (const [id, field] of [['002', 'Account Name'], ['003', 'Contract Start Date'], ['004', 'Contract Term (months)']]) add(`SF-CON-${id}`, `Required Contract field: ${field}`, 'contract', `${draftData} Empty ${field}; unique Description marker.`, [
  [`Open New Contract; omit ${field}; complete other required fields and Description.`, 'The tested field is empty; other data valid.'],
  ['Save.', `${field}: aria-invalid = true.`],
  ['Cancel and search Contract list using the owned Account name.', 'No created Contract matches; unfinished record journal can be closed.'],
], sales, 'account');
add('SF-CON-005', 'Edit Draft Contract Unicode terms', 'contract', `${draftData} Term = 24; “Updated terms: őű & clauses.”`, [
  ['Open Edit; enter 24 months and Unicode Special Terms; Save.', 'The dialog closes.'],
  ['Open fresh Details.', 'ContractTerm = 24; exact Unicode SpecialTerms; Status = Draft; owned Description marker verified.'],
], sales, 'contract');
add('SF-CON-006', 'Cancel Contract editing', 'contract', `${draftData} Unsaved term = 36.`, [
  ['Open Edit; enter term = 36; Cancel.', 'The dialog closes.'],
  ['Open fresh Details.', 'Original 12 months persist; owned Description marker correct.'],
], sales, 'contract');
add('SF-CON-007', 'Delete Draft Contract', 'contract', draftData, [
  ['Open Delete and confirm Delete.', 'The dialog closes; Salesforce leaves the owned Contract URL.'],
  ['Search Contract list for the exact Contract Number.', 'No match; deleted = true in the journal.'],
], sales, 'contract');
add('SF-CON-008', 'Activate Contract', 'contract', `${draftData} Draft → Activated.`, [
  ['Show more actions → Activate; confirm Activate.', 'Activate confirmation dialog closes.'],
  ['Open fresh Details.', 'Activated; AccountName persists; Activated By = E2E Sales Manager; Activated Date nonempty; owned Description marker correct.'],
], sales, 'contract');
add('SF-CON-009', 'Cancel completed Contract creation', 'contract', `${draftData} Start Date = UTC today; term = 12; owned marker.`, [
  ['Complete the New Contract form.', 'Account, date, 12 months and Description read back correctly.'],
  ['Cancel and search Contract list using the owned Account name.', 'The dialog closes; no Contract matches.'],
], sales, 'account');
add('SF-QUO-001', 'Draft Quote relationships and expiry', 'quote', `${draftData} Expiry = +14 UTC days.`, [], sales, 'quote');
add('SF-QUO-002', 'Required Quote Name', 'quote', `${draftData} Empty Quote Name.`, [
  ['Open New Quote under the owned Opportunity; leave Quote Name empty; Save.', 'Salesforce error dialog appears.'],
  ['Close the error dialog and inspect Quote Name.', 'Error dialog closes; Quote Name has aria-invalid = true.'],
  ['Cancel and open Opportunity Quotes related list.', 'Quotes heading visible; 0 items / No records to display / No results found; no Quote created.'],
], sales, 'opportunity');
add('SF-QUO-003', 'Cancel Quote creation', 'quote', `${draftData} Unique Quote name; expiry +14 days.`, [
  ['Open New Quote; enter name and expiry.', 'Entered values read back correctly.'],
  ['Cancel and search for the exact Quote name.', 'The dialog closes; no Quote matches.'],
], sales, 'opportunity');
add('SF-QUO-004', 'Edit Quote fields and costs', 'quote', `${draftData} New name; +45 days; Unicode description; Tax = 12.34; Shipping = 5.67.`, [
  ['Open Edit; enter new name, expiry, “Updated quote: áéőű & text.”, tax and shipping; Save.', 'The dialog closes; journal contains the new owned name.'],
  ['Open fresh Details.', 'New name, OpportunityName, +45-day expiry and exact description; Tax = 12.34; ShippingHandling = 5.67; GrandTotal = 18.01.'],
], sales, 'quote');
add('SF-QUO-005', 'Cancel Quote editing', 'quote', `${draftData} Unsaved name and Accepted status.`, [
  ['Open Edit; enter a new name and Status = Accepted; Cancel.', 'The dialog closes.'],
  ['Open fresh Details.', 'Original Quote Name and Draft Status persist.'],
], sales, 'quote');
add('SF-QUO-006', 'Quote Presented → Accepted', 'quote', draftData, [
  ['Open Edit; select Status = Presented; Save and open fresh Details.', 'Status = Presented.'],
  ['Open Edit; select Status = Accepted; Save and open fresh Details.', 'Status = Accepted.'],
], sales, 'quote');
add('SF-QUO-007', 'Cancel Quote deletion', 'quote', draftData, [
  ['Open Delete.', 'Delete visible in the confirmation dialog.'],
  ['Cancel and open fresh Details.', 'Original Quote Name remains readable.'],
], sales, 'quote');
add('SF-QUO-008', 'Confirm Quote deletion through UI', 'quote', draftData, [
  ['Open Delete and confirm Delete.', 'The dialog closes; Salesforce leaves the Quote URL.'],
  ['Search for the exact Quote name.', 'No match; deleted = true in the journal.'],
], sales, 'quote');
add('SF-QUO-009', 'Product line, totals and synchronization', 'quote', `${draftData} Owned active Product and custom Price Book; unit price = 125.50; quantity = 2; total = 251.00 USD.`, [
  ['Create owned Product through UI with unique name/code and Active selected; Add Standard Price = 125.50.', 'Saved dialogs close; owned Product ID known. Global activation of standard price book is not required.'],
  ['Create owned active Price Book through UI; Related → Add Products; select exact Product row, Next, Save.', 'Active checked; Price Book Entries (1) and $125.50 in the exact Product row visible.'],
  ...account, ...opportunity, ...quote,
  ['Quote Related → Add Products; verify owned Price Book and Save; select exact Product, Next.', 'Product checkbox selected; Edit Selected Quote Line Items visible.'],
  ['Set Quantity = 2; Tab; Save; open fresh Details and Related.', 'Quantity cell 2.00; Subtotal, Total Price and Grand Total = 251.00; Quote Line Items (1) and exact Product link visible.'],
  ['Show more actions → Start Sync → Continue.', 'Dialog closes; fresh Details: Syncing = true; Opportunity Amount = 251.00; other fields and Sales ownership correct.'],
  ['Show more actions → Stop Sync → Continue.', 'Syncing = false; Quote Subtotal/Total Price/Grand Total and Opportunity Amount remain 251.00.'],
]);
add('SF-ROLE-001', 'Sales Manager is Opportunity owner and creator', 'roles', draftData, [
  ['Open fresh Details and run complete Opportunity assertions.', 'Opportunity Owner and Created By exactly E2E Sales Manager; owned Account link and record fields correct.'],
], sales, 'opportunity');
add('SF-ROLE-002', 'Service Manager cannot create Opportunities', 'roles', 'Service session; no created business record.', [
  ['Open Opportunity list view.', 'Search this list visible; New button count zero.'],
  ['Navigate through UI directly to /lightning/o/Opportunity/new.', 'Visible insufficient-permission message; no Save dialog.'],
], service);
add('SF-ROLE-003', 'Service Manager creates and edits a Case', 'roles', `${draftData} Unique Case Subject; Origin = Phone; Status New → Working; Description = owned name.`, [
  ['Open New Case under the owned Account; enter Subject, New, Phone and Description; Save.', 'Dialog closes; owned Case ID known.'],
  ['Open fresh Details.', 'Subject exactly owned name; New; Created By = E2E Service Manager; owned Description marker and Case Number verified.'],
  ['Open Edit; select Working; Save and open fresh Details.', 'Working; owned record identity and Description marker correct.'],
], service, 'account');
add('SF-E2E-001', 'Complete Sales → Service handoff', 'integration', `${draftData} Same Account; Quote Accepted; Opportunity Won; Contract Activated, 12 months.`, [
  ['Set Opportunity Stage = Negotiation/Review; Save and open fresh Details.', 'Stage and complete Opportunity assertions correct.'],
  ...quote,
  ['Open Quote Edit; select Accepted; Save and open fresh Details.', 'Accepted; owned Opportunity Name and Account Name; Opportunity link targets exact owned Opportunity ID.'],
  ['Set Opportunity Stage = Closed Won; Save and open fresh Details.', 'Closed Won, 100%, current Close Date in Salesforce user timezone; fields and relationships correct.'],
  ...contract,
  ['Activate Contract and confirm; open fresh Details.', 'Activated; 12 months; same Account; Activated By = Sales Manager; Activated Date populated.'],
  ['Clear browser state; open new Service JWT session; open and close profile menu.', 'Visible profile name E2E Service Manager; new Service session active.'],
  ['Open fresh Details of the same Contract as Service Manager.', 'Activated, owned Account and Description marker readable; Edit and Delete button counts zero.'],
  ['Finally: open new Sales JWT session, verify profile and open fresh Opportunity Details.', 'E2E Sales Manager active; owned Opportunity Closed Won with 100%; cleanup runs as Sales.'],
], `${sales} → ${service} → ${sales}`, 'opportunity');
add('SF-AI-001', 'AI Opportunity editing', 'agent/sales', `${draftData} New unique name; Amount = 543.21.`, [
  ['Open Opportunity Edit; agent.act sets name and amount and saves.', 'Dialog closes; agent operates through UI only.'],
  ['Run deterministic fresh Details assertions.', 'New name and 543.21; all other fields, Account link and Sales ownership correct.'],
], sales, 'opportunity');
add('SF-AI-002', 'AI Contract editing and assertion', 'agent/sales', `${draftData} 24 months; unique Terms.`, [
  ['Open Contract Edit; agent.act sets term = 24 and unique Special Terms and saves.', 'Dialog closes.'],
  ['Run deterministic fresh Details assertions and agent.assert.', '24 months, exact Terms and Draft; AI also confirms visible Draft and 24 months.'],
], sales, 'contract');
add('SF-AI-003', 'AI Quote acceptance and extraction', 'agent/sales', draftData, [
  ['Open Quote Edit; agent.act selects Accepted and saves.', 'Dialog closes; deterministic fresh Details show Accepted.'],
  ['agent.extract reads visible Name, Status and Opportunity Name using a Zod schema.', 'Structured object contains exactly owned Quote name, Accepted and owned Opportunity name.'],
], sales, 'quote');
for (const [id, persona, session] of [['SF-AUTH', sales, 'salesforce'], ['SF-AUTH-SERVICE', service, 'service']]) cases.push({
  id, title: `${persona} JWT → Lightning session setup`, file: 'tests/auth.setup.e2e.ts', persona,
  data: 'Private JWT key, preauthorized client and role user; secrets excluded from design and public report.',
  preconditions: 'ECA Web scope, JWT enabled, user preauthorization assigned; no interactive email code required.',
  steps: [
    ['Start role-specific JWT / singleaccess authentication; follow the real Got it UI link if a future maintenance notice appears.', `JWT role ${persona}; configured client and RSA key; OTP/checksum values withheld.`, 'Native Lightning login completes without interactive code; tokens and nested redirect session parameters redacted.'],
    ['Verify Opportunity list and View profile.', `Role ${persona}; /lightning/o/Opportunity/list; View profile.`, `Search this list visible; ${persona === sales ? 'New visible; ' : ''}profile name exactly ${persona}.`],
    [`session.save('${session}').`, `Session name: ${session}; authenticated browser storage.`, 'Authenticated session can be saved; no business data changed.'],
  ],
});
export const testDesigns: readonly TestDesign[] = cases;
