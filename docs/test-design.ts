export type DesignStep = readonly [action: string, expected: string];
export interface TestDesign {
  id: string; title: string; file: string; persona: string; data: string;
  preconditions: string; steps: readonly DesignStep[];
}
const cases: TestDesign[] = [];
const sales = 'E2E Sales Manager';
const service = 'E2E Service Manager';
const auth: DesignStep = ['A szerepkör mentett Lightning-munkamenetének visszaállítása.', 'A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor.'];
const account: DesignStep[] = [
  ['Új Account űrlap megnyitása; egyedi Account Name kitöltése.', 'A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható.'],
  ['Account mentése és saját rekordoldalának megnyitása.', 'Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható.'],
];
const opportunity: DesignStep[] = [
  ['Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése.', 'Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat.'],
  ['Opportunity mentése; friss rekordoldal Details lapjának megnyitása.', 'Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager.'],
];
const contract: DesignStep[] = [
  ['Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel.', 'A Save és a kitöltött mezők láthatók; az Account előtöltött.'],
  ['Contract mentése; friss Details megnyitása.', 'Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül.'],
];
const quote: DesignStep[] = [
  ['Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése.', 'A Save és a beírt mezők láthatók; a saját Opportunity előtöltött.'],
  ['Quote mentése; friss Details megnyitása.', 'Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager.'],
];
const cleanup: DesignStep = ['A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet.', 'Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz.'];
const add = (id: string, title: string, file: string, data: string, steps: DesignStep[], persona = sales, fixture: 'account' | 'opportunity' | 'contract' | 'quote' | 'none' = 'none') => {
  const setup = fixture === 'none' ? [] : [...account, ...(fixture === 'opportunity' || fixture === 'quote' ? opportunity : []), ...(fixture === 'contract' ? contract : []), ...(fixture === 'quote' ? quote : [])];
  cases.push({ id, title, file: `tests/${file}.e2e.ts`, persona, data,
    preconditions: 'Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.',
    steps: [auth, ...setup, ...steps, cleanup] });
};
const draftData = 'Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.';
add('SF-AUTH-001', 'Hitelesített Opportunity lista elérhető', 'auth', 'Mentett Sales-munkamenet; nincs üzleti adat.', [
  ['Opportunity listanézet megnyitása.', 'Az URL /lightning/o/Opportunity/list; New gomb látható.'],
]);
add('SF-OPP-001', 'Opportunity teljes értékesítési életciklusa', 'opportunity', `${draftData} Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won.`, [
  ...['Qualification', 'Proposal/Price Quote', 'Negotiation/Review'].map(stage => [`Edit megnyitása, Stage = ${stage}, Save, friss Details.`, `Stage = ${stage}; a név, összeg, leírás, Account és Sales Owner/Created By változatlan.`] as DesignStep),
  ['Stage = Closed Won; Save, friss Details.', 'Stage = Closed Won; Probability = 100%. Jövőbeli Close Date a Salesforce-felhasználó mai dátumára változik; éjfélátlépésnél a mentés előtti vagy utáni budapesti nap megengedett.'],
], sales, 'opportunity');
for (const [id, field] of [['002', 'Opportunity Name'], ['003', 'Close Date'], ['004', 'Stage']]) add(`SF-OPP-${id}`, `Kötelező mező: ${field}`, 'opportunity', `${draftData} Üres/--None--: ${field}; a többi kötelező mező érvényes.`, [
  ['Opportunity űrlap előkészítése; csak a vizsgált kötelező mező üres vagy --None--.', 'A helyes Account előtöltött; a többi mező kitöltött; mentés előtt nincs Opportunity ID.'],
  ['Save megnyomása.', `A ${field} mező aria-invalid = true; a létrehozási dialog nyitva marad.`],
  ['Cancel; keresés a pontos saját Opportunity-névre.', 'A dialog bezárul; a lista nem tartalmazza a rekordot.'],
], sales, 'account');
add('SF-OPP-005', 'Opportunity létrehozás elvetése', 'opportunity', draftData, [
  ['Teljes Opportunity űrlap előkészítése érvényes alapadatokkal.', 'A név, összeg, dátum és Stage beírása visszaellenőrzött; nincs mentés.'],
  ['Cancel; pontos név keresése az Opportunity listában.', 'A dialog bezárul; a rekord nem szerepel a listában.'],
], sales, 'account');
add('SF-OPP-006', 'Opportunity név, összeg, dátum, Unicode szerkesztése', 'opportunity', `${draftData} Új név; 98765.43 USD; +60 nap; „Unicode áéíóöőúüű & symbols.”`, [
  ['Edit; az új név, összeg, Close Date és leírás kitöltése; Save.', 'Az űrlap bezárul. A napló a ténylegesen mentendő új nevet tartalmazza.'],
  ['Friss Details és Account-link ellenőrzése.', 'Az új név, 98765.43, +60 napos dátum és teljes Unicode leírás olvasható; Stage, Account és Sales Owner/Created By helyes.'],
  ['Keresés a régi pontos névre.', 'A régi névhez nincs pontos link; az aszinkron keresőindex átmenetileg visszaadhatja az új névre átnevezett sort.'],
], sales, 'opportunity');
add('SF-OPP-007', 'Opportunity szerkesztés elvetése', 'opportunity', `${draftData} Nem mentett név; Amount = 1.`, [
  ['Edit; név és Amount = 1 kitöltése; Cancel.', 'A dialog bezárul.'],
  ['Friss Details megnyitása és teljes Opportunity-orákulum.', 'Az eredeti név, 12345.67 USD, dátum, Stage, leírás és Account marad; Sales Owner/Created By helyes.'],
], sales, 'opportunity');
add('SF-OPP-008', 'Closed Lost és automatikus valószínűség', 'opportunity', `${draftData} Closed Lost; 0%.`, [
  ['Edit; Stage = Closed Lost; Save; friss Details.', 'Closed Lost és 0% Probability; eredeti Close Date, összeg és kapcsolatok változatlanok.'],
], sales, 'opportunity');
add('SF-OPP-009', 'Closed Lost újranyitása', 'opportunity', `${draftData} Closed Lost → Qualification.`, [
  ['Stage = Closed Lost; Save; friss Details.', 'Closed Lost, Probability = 0%.'],
  ['Stage = Qualification; Save; friss Details.', 'Qualification; 0% < Probability < 100%; a rekord alapadatai, Account és Sales tulajdonosa változatlan.'],
], sales, 'opportunity');
add('SF-OPP-010', 'Opportunity törlés elvetése', 'opportunity', draftData, [
  ['Delete művelet megnyitása.', 'A Delete megerősítő dialog és a Delete gomb látható.'],
  ['Cancel; friss Details megnyitása.', 'A rekord teljes eredeti adatsora és kapcsolatai megmaradnak.'],
], sales, 'opportunity');
add('SF-OPP-011', 'Opportunity megerősített UI-törlés', 'opportunity', draftData, [
  ['Delete dialog; Delete megerősítése.', 'A dialog bezárul; a Salesforce elnavigál a törölt rekord URL-jéről.'],
  ['Pontos név keresése az Opportunity listában.', 'Nulla pontos találat; csak ekkor lesz a saját naplóban deleted = true.'],
], sales, 'opportunity');
for (const [id, amount] of [['012', '0'], ['013', '0.01']]) add(`SF-OPP-${id}`, `Opportunity összeg: ${amount}`, 'opportunity', `${draftData} Amount = ${amount} USD.`, [
  [`Opportunity létrehozása ${amount} összeggel a saját Account alatt; Save.`, 'A dialog bezárul; saját Opportunity ID kerül az URL-be.'],
  ['Friss Details és teljes Opportunity-orákulum.', `Amount = ${amount} (két tizedes pontosság); név, dátum, Prospecting, leírás, Account-link és Sales Owner/Created By helyes.`],
], sales, 'account');
add('SF-CON-001', 'Draft Contract létrehozás', 'contract', `${draftData} Start Date = UTC ma; term = 12; Unicode feltételek.`, [], sales, 'contract');
for (const [id, field] of [['002', 'Account Name'], ['003', 'Contract Start Date'], ['004', 'Contract Term (months)']]) add(`SF-CON-${id}`, `Contract kötelező mező: ${field}`, 'contract', `${draftData} Üres ${field}; egyedi Description-jelölő.`, [
  [`Új Contract űrlap; ${field} kihagyása; többi kötelező mező és Description kitöltése.`, 'A vizsgált mező üres; a többi adat érvényes.'],
  ['Save.', `${field}: aria-invalid = true.`],
  ['Cancel; saját Account-név alapján Contract-lista keresése.', 'Nincs létrehozott Contract-találat; a félkész rekord naplója lezárható.'],
], sales, 'account');
add('SF-CON-005', 'Draft Contract Unicode szerkesztése', 'contract', `${draftData} Term = 24; „Módosított feltételek: őű & clauses.”`, [
  ['Edit; 24 hónap és Unicode Special Terms; Save.', 'A dialog bezárul.'],
  ['Friss Details.', 'ContractTerm = 24; pontos Unicode SpecialTerms; Status = Draft. A saját Description-jelölő ellenőrzött.'],
], sales, 'contract');
add('SF-CON-006', 'Contract szerkesztés elvetése', 'contract', `${draftData} Nem mentett term = 36.`, [
  ['Edit; term = 36; Cancel.', 'A dialog bezárul.'],
  ['Friss Details.', 'Az eredeti 12 hónap marad; saját Description-jelölő helyes.'],
], sales, 'contract');
add('SF-CON-007', 'Draft Contract törlés', 'contract', draftData, [
  ['Delete dialog megnyitása; Delete.', 'Dialog bezárul; elnavigálás a saját Contract URL-jéről.'],
  ['Pontos Contract Number keresése a Contract-listában.', 'Nincs találat; deleted = true a naplóban.'],
], sales, 'contract');
add('SF-CON-008', 'Contract aktiválás', 'contract', `${draftData} Draft → Activated.`, [
  ['Show more actions → Activate; Activate megerősítése.', 'Az Activate megerősítő dialog bezárul.'],
  ['Friss Details.', 'Status = Activated; AccountName változatlan; Activated By = E2E Sales Manager; Activated Date nem üres; saját Description-jelölő helyes.'],
], sales, 'contract');
add('SF-CON-009', 'Kitöltött Contract létrehozás elvetése', 'contract', `${draftData} Start Date = UTC ma; term = 12; saját marker.`, [
  ['Új Contract űrlap teljes kitöltése.', 'Account, dátum, 12 hónap és Description beírása visszaellenőrzött.'],
  ['Cancel; saját Account-név keresése a Contract-listában.', 'A dialog bezárul; nincs Contract-találat.'],
], sales, 'account');
add('SF-QUO-001', 'Draft Quote kapcsolat és lejárat', 'quote', `${draftData} Lejárat = +14 UTC nap.`, [], sales, 'quote');
add('SF-QUO-002', 'Kötelező Quote Name', 'quote', `${draftData} Üres Quote Name.`, [
  ['Új Quote a saját Opportunity alatt; Quote Name üres; Save.', 'Salesforce hiba-dialog jelenik meg.'],
  ['Close error dialog; Quote Name ellenőrzése.', 'A hiba-dialog bezárul; Quote Name aria-invalid = true.'],
  ['Cancel; Opportunity Quotes related list megnyitása.', 'Quotes címsor látható; 0 items / No records to display / No results found; nem keletkezett Quote.'],
], sales, 'opportunity');
add('SF-QUO-003', 'Quote létrehozás elvetése', 'quote', `${draftData} Egyedi Quote-név; +14 napos lejárat.`, [
  ['Új Quote űrlap; név és lejárat kitöltése.', 'A mezőértékek visszaellenőrzöttek.'],
  ['Cancel; pontos Quote-név keresése.', 'A dialog bezárul; nincs Quote-találat.'],
], sales, 'opportunity');
add('SF-QUO-004', 'Quote adatok és költségek szerkesztése', 'quote', `${draftData} Új név; +45 nap; Unicode leírás; Tax = 12.34; Shipping = 5.67.`, [
  ['Edit; új név, lejárat, „Módosított ajánlat: áéőű & text.”, adó és szállítás kitöltése; Save.', 'A dialog bezárul; új saját név a naplóban.'],
  ['Friss Details.', 'Új név, OpportunityName, +45 napos lejárat és pontos leírás; Tax = 12.34; ShippingHandling = 5.67; GrandTotal = 18.01.'],
], sales, 'quote');
add('SF-QUO-005', 'Quote szerkesztés elvetése', 'quote', `${draftData} Nem mentett név és Accepted.`, [
  ['Edit; új név és Status = Accepted; Cancel.', 'A dialog bezárul.'],
  ['Friss Details.', 'Az eredeti Quote Name és Draft Status marad.'],
], sales, 'quote');
add('SF-QUO-006', 'Quote Presented → Accepted', 'quote', draftData, [
  ['Edit; Status = Presented; Save; friss Details.', 'Status = Presented.'],
  ['Edit; Status = Accepted; Save; friss Details.', 'Status = Accepted.'],
], sales, 'quote');
add('SF-QUO-007', 'Quote törlés elvetése', 'quote', draftData, [
  ['Delete dialog megnyitása.', 'A Delete gomb látható a megerősítő dialogban.'],
  ['Cancel; friss Details.', 'Az eredeti Quote Name továbbra is olvasható.'],
], sales, 'quote');
add('SF-QUO-008', 'Quote megerősített UI-törlés', 'quote', draftData, [
  ['Delete dialog; Delete.', 'A dialog bezárul; UI elnavigál a Quote URL-jéről.'],
  ['Pontos Quote-név keresése.', 'Nincs találat; deleted = true a naplóban.'],
], sales, 'quote');
add('SF-QUO-009', 'Terméktétel, összesítés és szinkronizálás', 'quote', `${draftData} Saját aktív termék és aktív egyéni Price Book; egységár = 125.50; mennyiség = 2; összeg = 251.00 USD.`, [
  ['UI-n saját Product létrehozása egyedi név/kóddal, Active jelöléssel; Add Standard Price = 125.50.', 'A mentések lezárják a dialogot; saját Product ID ismert. A standard árlista globális aktiválását a teszt nem igényli.'],
  ['UI-n aktív saját Price Book létrehozása; Related → Add Products; pontos terméksor kiválasztása, Next, Save.', 'Active checkbox jelölt; Price Book Entries (1) és a pontos terméksorban $125.50 látható.'],
  ...account, ...opportunity, ...quote,
  ['Quote Related → Add Products; saját Price Book ellenőrzése és Save; pontos termék kiválasztása, Next.', 'A kiválasztott termék checkboxa jelölt; Edit Selected Quote Line Items dialog látható.'],
  ['Quantity = 2; Tab; Save; friss Details és Related.', 'Quantity cella 2.00; Subtotal, Total Price, Grand Total = 251.00; Quote Line Items (1); pontos terméklink látható.'],
  ['Show more actions → Start Sync → Continue.', 'Dialog bezárul; friss Details: Syncing = true; Opportunity Amount = 251.00, további alapadatok és Sales tulajdonos helyes.'],
  ['Show more actions → Stop Sync → Continue.', 'Syncing = false; Quote Subtotal/Total Price/Grand Total és Opportunity Amount marad 251.00.'],
]);
add('SF-ROLE-001', 'Sales Manager Opportunity tulajdonos és létrehozó', 'roles', draftData, [
  ['Friss Details és teljes Opportunity-orákulum.', 'Opportunity Owner és Created By pontosan E2E Sales Manager; saját Account-link és alapadatok helyesek.'],
], sales, 'opportunity');
add('SF-ROLE-002', 'Service Manager nem hozhat létre Opportunityt', 'roles', 'Service-munkamenet; nincs létrehozott üzleti rekord.', [
  ['Opportunity listanézet megnyitása.', 'Search this list vezérlő látható; New gombból 0 darab.'],
  ['Közvetlen /lightning/o/Opportunity/new UI-navigáció.', 'Jogosultsághiányról szóló látható üzenet; nincs Save-dialog.'],
], service);
add('SF-ROLE-003', 'Service Manager Case létrehozás és szerkesztés', 'roles', `${draftData} Case: Subject egyedi; Origin = Phone; Status New → Working; Description = saját név.`, [
  ['Új Case a saját Account alatt; Subject, New, Phone és Description; Save.', 'A dialog bezárul; saját Case ID ismert.'],
  ['Friss Details.', 'Subject pontosan saját név; Status = New; Created By = E2E Service Manager; saját Description-jelölő és Case Number ellenőrzött.'],
  ['Edit; Status = Working; Save; friss Details.', 'Status = Working; saját rekordazonosító és Description-jelölő helyes.'],
], service, 'account');
add('SF-E2E-001', 'Sales → Service teljes folyamat', 'integration', `${draftData} Ugyanaz az Account; Quote Accepted; Opportunity Won; Contract Activated, 12 hónap.`, [
  ['Opportunity Stage = Negotiation/Review; Save; friss Details.', 'Stage és teljes Opportunity-orákulum helyes.'],
  ...quote,
  ['Quote Edit; Status = Accepted; Save; friss Details.', 'Accepted, saját Opportunity Name és Account Name; Opportunity-link a pontos Opportunity ID-jára mutat.'],
  ['Opportunity Stage = Closed Won; Save; friss Details.', 'Closed Won, 100%, Salesforce-felhasználó szerinti mai Close Date; alapadatok és kapcsolatok helyesek.'],
  ...contract,
  ['Contract Activate és megerősítés; friss Details.', 'Activated; 12 hónap; ugyanaz az Account; Activated By = Sales Manager; Activated Date kitöltött.'],
  ['Böngészőállapot törlése; Service JWT-belépés; profil megnyitása és bezárása.', 'A látható profilnév E2E Service Manager; új Service-munkamenet aktív.'],
  ['Ugyanazon Contract friss Details megnyitása Service-ként.', 'Activated státusz, saját Account és Description-jelölő olvasható; Edit és Delete gombból 0 darab.'],
  ['Finally: új Sales JWT-belépés, profil ellenőrzése; Opportunity friss Details.', 'E2E Sales Manager aktív; saját Opportunity Closed Won és 100%; takarítás Sales-ként fut.'],
], `${sales} → ${service} → ${sales}`, 'opportunity');
add('SF-AI-001', 'AI Opportunity szerkesztés', 'agent/sales', `${draftData} Új egyedi név; Amount = 543.21.`, [
  ['Opportunity Edit; agent.act a név és összeg beállítására, Save.', 'A dialog bezárul; az agent kizárólag UI-n dolgozik.'],
  ['Determinista friss Details-orákulum.', 'Új név és 543.21; az összes többi alapadat, Account-link és Sales tulajdonos helyes.'],
], sales, 'opportunity');
add('SF-AI-002', 'AI Contract szerkesztés és assert', 'agent/sales', `${draftData} 24 hónap; egyedi Terms.`, [
  ['Contract Edit; agent.act: term = 24, Special Terms = egyedi érték; Save.', 'A dialog bezárul.'],
  ['Determinista friss Details és agent.assert.', '24 hónap, pontos Terms és Draft; az AI a látható Draft státuszt és 24 hónapot is megerősíti.'],
], sales, 'contract');
add('SF-AI-003', 'AI Quote elfogadás és extract', 'agent/sales', draftData, [
  ['Quote Edit; agent.act: Accepted és Save.', 'A dialog bezárul; determinista friss Details: Accepted.'],
  ['agent.extract a látható Name, Status és Opportunity Name mezőkre, Zod-sémával.', 'A strukturált objektum pontosan a saját Quote-nevet, Accepted értéket és saját Opportunity-nevet tartalmazza.'],
], sales, 'quote');
for (const [id, persona, session] of [['SF-AUTH', sales, 'salesforce'], ['SF-AUTH-SERVICE', service, 'service']]) cases.push({
  id, title: `${persona} JWT → Lightning session setup`, file: 'tests/auth.setup.e2e.ts', persona,
  data: 'Privát JWT-kulcs, preautorizált kliens és szerepkör-felhasználó; a titkok nem részei a designnak vagy publikus riportnak.',
  preconditions: 'ECA Web scope, JWT engedély, felhasználóhoz rendelt preautorizáció; nem szükséges interaktív e-mailkód.',
  steps: [
    ['A szerepkör JWT / singleaccess hitelesítésének indítása az engine-ben.', 'A natív Lightning-belépés interaktív kód nélkül lezárul; token nincs a naplóban.'],
    ['Opportunity lista és View profile ellenőrzése.', `A Search this list látható; ${persona === sales ? 'New látható; ' : ''}a profilnév pontosan ${persona}.`],
    [`session.save('${session}').`, 'A hitelesített munkamenet menthető; nincs üzleti adatmódosítás.'],
  ],
});
export const testDesigns: readonly TestDesign[] = cases;
