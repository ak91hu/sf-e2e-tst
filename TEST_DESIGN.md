# Salesforce UI – tesztlépés szintű test design

41 design: 36 alapértelmezett regressziós UI-eset, 3 opcionális AI UI-eset és 2 hitelesítési setup. A design tesztterv; a tényleges végrehajtás eredménye a VERIFICATION.md-ben és az Allure-ban található. A közös előkészítés lépéseit minden eset táblázata kibontva tartalmazza.

A Salesforce üzleti adatok előkészítése, ellenőrzése és takarítása kizárólag UI-n történik. A hitelesítési endpointok és az egyszeri adminisztratív provisioning külön konfigurációs feladatok. Minden eset izolált saját adatot használ, az admin nem hoz létre Opportunityt. A lépések sikerét látható mező, vezérlő, rekord-URL vagy listaeredmény bizonyítja. Nincs fix várakozás, API-orákulum vagy automatikus tesztújrapróbálkozás.

A konkrét napi dátumok futáskor képződnek; a `futureDate` UTC-alapú, a Salesforce Closed Won automatikus dátuma a felhasználó időzónáját követi (`SF_TIME_ZONE`, alapértelmezés Europe/Budapest). Stage-értékek és Won/Lost százalékok környezeti változókkal illeszthetők más org-hoz; az alábbi design a konfigurált Developer Edition alapértékeit írja le. Az AI-esetekhez külön modell-hozzáférés és kvóta kell.

Szerkeszthető forrás: [docs/test-design.ts](docs/test-design.ts). Frissítés: `npm run design:generate`; eltérésellenőrzés: `npm run design:check`. Az Allure minden megfeleltetett eset leírásában ugyanezeket az elvárt lépéseket mutatja.

| Azonosító | Cél | Szerepkör |
| --- | --- | --- |
| [SF-AUTH-001](#sf-auth-001) | Hitelesített Opportunity lista elérhető | E2E Sales Manager |
| [SF-OPP-001](#sf-opp-001) | Opportunity teljes értékesítési életciklusa | E2E Sales Manager |
| [SF-OPP-002](#sf-opp-002) | Kötelező mező: Opportunity Name | E2E Sales Manager |
| [SF-OPP-003](#sf-opp-003) | Kötelező mező: Close Date | E2E Sales Manager |
| [SF-OPP-004](#sf-opp-004) | Kötelező mező: Stage | E2E Sales Manager |
| [SF-OPP-005](#sf-opp-005) | Opportunity létrehozás elvetése | E2E Sales Manager |
| [SF-OPP-006](#sf-opp-006) | Opportunity név, összeg, dátum, Unicode szerkesztése | E2E Sales Manager |
| [SF-OPP-007](#sf-opp-007) | Opportunity szerkesztés elvetése | E2E Sales Manager |
| [SF-OPP-008](#sf-opp-008) | Closed Lost és automatikus valószínűség | E2E Sales Manager |
| [SF-OPP-009](#sf-opp-009) | Closed Lost újranyitása | E2E Sales Manager |
| [SF-OPP-010](#sf-opp-010) | Opportunity törlés elvetése | E2E Sales Manager |
| [SF-OPP-011](#sf-opp-011) | Opportunity megerősített UI-törlés | E2E Sales Manager |
| [SF-OPP-012](#sf-opp-012) | Opportunity összeg: 0 | E2E Sales Manager |
| [SF-OPP-013](#sf-opp-013) | Opportunity összeg: 0.01 | E2E Sales Manager |
| [SF-CON-001](#sf-con-001) | Draft Contract létrehozás | E2E Sales Manager |
| [SF-CON-002](#sf-con-002) | Contract kötelező mező: Account Name | E2E Sales Manager |
| [SF-CON-003](#sf-con-003) | Contract kötelező mező: Contract Start Date | E2E Sales Manager |
| [SF-CON-004](#sf-con-004) | Contract kötelező mező: Contract Term (months) | E2E Sales Manager |
| [SF-CON-005](#sf-con-005) | Draft Contract Unicode szerkesztése | E2E Sales Manager |
| [SF-CON-006](#sf-con-006) | Contract szerkesztés elvetése | E2E Sales Manager |
| [SF-CON-007](#sf-con-007) | Draft Contract törlés | E2E Sales Manager |
| [SF-CON-008](#sf-con-008) | Contract aktiválás | E2E Sales Manager |
| [SF-CON-009](#sf-con-009) | Kitöltött Contract létrehozás elvetése | E2E Sales Manager |
| [SF-QUO-001](#sf-quo-001) | Draft Quote kapcsolat és lejárat | E2E Sales Manager |
| [SF-QUO-002](#sf-quo-002) | Kötelező Quote Name | E2E Sales Manager |
| [SF-QUO-003](#sf-quo-003) | Quote létrehozás elvetése | E2E Sales Manager |
| [SF-QUO-004](#sf-quo-004) | Quote adatok és költségek szerkesztése | E2E Sales Manager |
| [SF-QUO-005](#sf-quo-005) | Quote szerkesztés elvetése | E2E Sales Manager |
| [SF-QUO-006](#sf-quo-006) | Quote Presented → Accepted | E2E Sales Manager |
| [SF-QUO-007](#sf-quo-007) | Quote törlés elvetése | E2E Sales Manager |
| [SF-QUO-008](#sf-quo-008) | Quote megerősített UI-törlés | E2E Sales Manager |
| [SF-QUO-009](#sf-quo-009) | Terméktétel, összesítés és szinkronizálás | E2E Sales Manager |
| [SF-ROLE-001](#sf-role-001) | Sales Manager Opportunity tulajdonos és létrehozó | E2E Sales Manager |
| [SF-ROLE-002](#sf-role-002) | Service Manager nem hozhat létre Opportunityt | E2E Service Manager |
| [SF-ROLE-003](#sf-role-003) | Service Manager Case létrehozás és szerkesztés | E2E Service Manager |
| [SF-E2E-001](#sf-e2e-001) | Sales → Service teljes folyamat | E2E Sales Manager → E2E Service Manager → E2E Sales Manager |
| [SF-AI-001](#sf-ai-001) | AI Opportunity szerkesztés | E2E Sales Manager |
| [SF-AI-002](#sf-ai-002) | AI Contract szerkesztés és assert | E2E Sales Manager |
| [SF-AI-003](#sf-ai-003) | AI Quote elfogadás és extract | E2E Sales Manager |
| [SF-AUTH](#sf-auth) | E2E Sales Manager JWT → Lightning session setup | E2E Sales Manager |
| [SF-AUTH-SERVICE](#sf-auth-service) | E2E Service Manager JWT → Lightning session setup | E2E Service Manager |

## SF-AUTH-001

**Cél:** Hitelesített Opportunity lista elérhető

**Forrás:** [tests/auth.e2e.ts](tests/auth.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Mentett Sales-munkamenet; nincs üzleti adat.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Opportunity listanézet megnyitása. | Az URL /lightning/o/Opportunity/list; New gomb látható. |
| 3 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-001

**Cél:** Opportunity teljes értékesítési életciklusa

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Stage: Prospecting → Qualification → Proposal/Price Quote → Negotiation/Review → Closed Won.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Edit megnyitása, Stage = Qualification, Save, friss Details. | Stage = Qualification; a név, összeg, leírás, Account és Sales Owner/Created By változatlan. |
| 7 | Edit megnyitása, Stage = Proposal/Price Quote, Save, friss Details. | Stage = Proposal/Price Quote; a név, összeg, leírás, Account és Sales Owner/Created By változatlan. |
| 8 | Edit megnyitása, Stage = Negotiation/Review, Save, friss Details. | Stage = Negotiation/Review; a név, összeg, leírás, Account és Sales Owner/Created By változatlan. |
| 9 | Stage = Closed Won; Save, friss Details. | Stage = Closed Won; Probability = 100%. Jövőbeli Close Date a Salesforce-felhasználó mai dátumára változik; éjfélátlépésnél a mentés előtti vagy utáni budapesti nap megengedett. |
| 10 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-002

**Cél:** Kötelező mező: Opportunity Name

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Üres/--None--: Opportunity Name; a többi kötelező mező érvényes.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Opportunity űrlap előkészítése; csak a vizsgált kötelező mező üres vagy --None--. | A helyes Account előtöltött; a többi mező kitöltött; mentés előtt nincs Opportunity ID. |
| 5 | Save megnyomása. | A Opportunity Name mező aria-invalid = true; a létrehozási dialog nyitva marad. |
| 6 | Cancel; keresés a pontos saját Opportunity-névre. | A dialog bezárul; a lista nem tartalmazza a rekordot. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-003

**Cél:** Kötelező mező: Close Date

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Üres/--None--: Close Date; a többi kötelező mező érvényes.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Opportunity űrlap előkészítése; csak a vizsgált kötelező mező üres vagy --None--. | A helyes Account előtöltött; a többi mező kitöltött; mentés előtt nincs Opportunity ID. |
| 5 | Save megnyomása. | A Close Date mező aria-invalid = true; a létrehozási dialog nyitva marad. |
| 6 | Cancel; keresés a pontos saját Opportunity-névre. | A dialog bezárul; a lista nem tartalmazza a rekordot. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-004

**Cél:** Kötelező mező: Stage

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Üres/--None--: Stage; a többi kötelező mező érvényes.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Opportunity űrlap előkészítése; csak a vizsgált kötelező mező üres vagy --None--. | A helyes Account előtöltött; a többi mező kitöltött; mentés előtt nincs Opportunity ID. |
| 5 | Save megnyomása. | A Stage mező aria-invalid = true; a létrehozási dialog nyitva marad. |
| 6 | Cancel; keresés a pontos saját Opportunity-névre. | A dialog bezárul; a lista nem tartalmazza a rekordot. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-005

**Cél:** Opportunity létrehozás elvetése

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Teljes Opportunity űrlap előkészítése érvényes alapadatokkal. | A név, összeg, dátum és Stage beírása visszaellenőrzött; nincs mentés. |
| 5 | Cancel; pontos név keresése az Opportunity listában. | A dialog bezárul; a rekord nem szerepel a listában. |
| 6 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-006

**Cél:** Opportunity név, összeg, dátum, Unicode szerkesztése

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Új név; 98765.43 USD; +60 nap; „Unicode áéíóöőúüű & symbols.”

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Edit; az új név, összeg, Close Date és leírás kitöltése; Save. | Az űrlap bezárul. A napló a ténylegesen mentendő új nevet tartalmazza. |
| 7 | Friss Details és Account-link ellenőrzése. | Az új név, 98765.43, +60 napos dátum és teljes Unicode leírás olvasható; Stage, Account és Sales Owner/Created By helyes. |
| 8 | Keresés a régi pontos névre. | A régi névhez nincs pontos link; az aszinkron keresőindex átmenetileg visszaadhatja az új névre átnevezett sort. |
| 9 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-007

**Cél:** Opportunity szerkesztés elvetése

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Nem mentett név; Amount = 1.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Edit; név és Amount = 1 kitöltése; Cancel. | A dialog bezárul. |
| 7 | Friss Details megnyitása és teljes Opportunity-orákulum. | Az eredeti név, 12345.67 USD, dátum, Stage, leírás és Account marad; Sales Owner/Created By helyes. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-008

**Cél:** Closed Lost és automatikus valószínűség

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Closed Lost; 0%.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Edit; Stage = Closed Lost; Save; friss Details. | Closed Lost és 0% Probability; eredeti Close Date, összeg és kapcsolatok változatlanok. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-009

**Cél:** Closed Lost újranyitása

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Closed Lost → Qualification.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Stage = Closed Lost; Save; friss Details. | Closed Lost, Probability = 0%. |
| 7 | Stage = Qualification; Save; friss Details. | Qualification; 0% < Probability < 100%; a rekord alapadatai, Account és Sales tulajdonosa változatlan. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-010

**Cél:** Opportunity törlés elvetése

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Delete művelet megnyitása. | A Delete megerősítő dialog és a Delete gomb látható. |
| 7 | Cancel; friss Details megnyitása. | A rekord teljes eredeti adatsora és kapcsolatai megmaradnak. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-011

**Cél:** Opportunity megerősített UI-törlés

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Delete dialog; Delete megerősítése. | A dialog bezárul; a Salesforce elnavigál a törölt rekord URL-jéről. |
| 7 | Pontos név keresése az Opportunity listában. | Nulla pontos találat; csak ekkor lesz a saját naplóban deleted = true. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-012

**Cél:** Opportunity összeg: 0

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Amount = 0 USD.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Opportunity létrehozása 0 összeggel a saját Account alatt; Save. | A dialog bezárul; saját Opportunity ID kerül az URL-be. |
| 5 | Friss Details és teljes Opportunity-orákulum. | Amount = 0 (két tizedes pontosság); név, dátum, Prospecting, leírás, Account-link és Sales Owner/Created By helyes. |
| 6 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-OPP-013

**Cél:** Opportunity összeg: 0.01

**Forrás:** [tests/opportunity.e2e.ts](tests/opportunity.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Amount = 0.01 USD.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Opportunity létrehozása 0.01 összeggel a saját Account alatt; Save. | A dialog bezárul; saját Opportunity ID kerül az URL-be. |
| 5 | Friss Details és teljes Opportunity-orákulum. | Amount = 0.01 (két tizedes pontosság); név, dátum, Prospecting, leírás, Account-link és Sales Owner/Created By helyes. |
| 6 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-001

**Cél:** Draft Contract létrehozás

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Start Date = UTC ma; term = 12; Unicode feltételek.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel. | A Save és a kitöltött mezők láthatók; az Account előtöltött. |
| 5 | Contract mentése; friss Details megnyitása. | Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül. |
| 6 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-002

**Cél:** Contract kötelező mező: Account Name

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Üres Account Name; egyedi Description-jelölő.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap; Account Name kihagyása; többi kötelező mező és Description kitöltése. | A vizsgált mező üres; a többi adat érvényes. |
| 5 | Save. | Account Name: aria-invalid = true. |
| 6 | Cancel; saját Account-név alapján Contract-lista keresése. | Nincs létrehozott Contract-találat; a félkész rekord naplója lezárható. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-003

**Cél:** Contract kötelező mező: Contract Start Date

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Üres Contract Start Date; egyedi Description-jelölő.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap; Contract Start Date kihagyása; többi kötelező mező és Description kitöltése. | A vizsgált mező üres; a többi adat érvényes. |
| 5 | Save. | Contract Start Date: aria-invalid = true. |
| 6 | Cancel; saját Account-név alapján Contract-lista keresése. | Nincs létrehozott Contract-találat; a félkész rekord naplója lezárható. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-004

**Cél:** Contract kötelező mező: Contract Term (months)

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Üres Contract Term (months); egyedi Description-jelölő.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap; Contract Term (months) kihagyása; többi kötelező mező és Description kitöltése. | A vizsgált mező üres; a többi adat érvényes. |
| 5 | Save. | Contract Term (months): aria-invalid = true. |
| 6 | Cancel; saját Account-név alapján Contract-lista keresése. | Nincs létrehozott Contract-találat; a félkész rekord naplója lezárható. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-005

**Cél:** Draft Contract Unicode szerkesztése

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Term = 24; „Módosított feltételek: őű & clauses.”

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel. | A Save és a kitöltött mezők láthatók; az Account előtöltött. |
| 5 | Contract mentése; friss Details megnyitása. | Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül. |
| 6 | Edit; 24 hónap és Unicode Special Terms; Save. | A dialog bezárul. |
| 7 | Friss Details. | ContractTerm = 24; pontos Unicode SpecialTerms; Status = Draft. A saját Description-jelölő ellenőrzött. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-006

**Cél:** Contract szerkesztés elvetése

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Nem mentett term = 36.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel. | A Save és a kitöltött mezők láthatók; az Account előtöltött. |
| 5 | Contract mentése; friss Details megnyitása. | Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül. |
| 6 | Edit; term = 36; Cancel. | A dialog bezárul. |
| 7 | Friss Details. | Az eredeti 12 hónap marad; saját Description-jelölő helyes. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-007

**Cél:** Draft Contract törlés

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel. | A Save és a kitöltött mezők láthatók; az Account előtöltött. |
| 5 | Contract mentése; friss Details megnyitása. | Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül. |
| 6 | Delete dialog megnyitása; Delete. | Dialog bezárul; elnavigálás a saját Contract URL-jéről. |
| 7 | Pontos Contract Number keresése a Contract-listában. | Nincs találat; deleted = true a naplóban. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-008

**Cél:** Contract aktiválás

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Draft → Activated.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel. | A Save és a kitöltött mezők láthatók; az Account előtöltött. |
| 5 | Contract mentése; friss Details megnyitása. | Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül. |
| 6 | Show more actions → Activate; Activate megerősítése. | Az Activate megerősítő dialog bezárul. |
| 7 | Friss Details. | Status = Activated; AccountName változatlan; Activated By = E2E Sales Manager; Activated Date nem üres; saját Description-jelölő helyes. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-CON-009

**Cél:** Kitöltött Contract létrehozás elvetése

**Forrás:** [tests/contract.e2e.ts](tests/contract.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Start Date = UTC ma; term = 12; saját marker.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap teljes kitöltése. | Account, dátum, 12 hónap és Description beírása visszaellenőrzött. |
| 5 | Cancel; saját Account-név keresése a Contract-listában. | A dialog bezárul; nincs Contract-találat. |
| 6 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-001

**Cél:** Draft Quote kapcsolat és lejárat

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Lejárat = +14 UTC nap.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 7 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-002

**Cél:** Kötelező Quote Name

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Üres Quote Name.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote a saját Opportunity alatt; Quote Name üres; Save. | Salesforce hiba-dialog jelenik meg. |
| 7 | Close error dialog; Quote Name ellenőrzése. | A hiba-dialog bezárul; Quote Name aria-invalid = true. |
| 8 | Cancel; Opportunity Quotes related list megnyitása. | Quotes címsor látható; 0 items / No records to display / No results found; nem keletkezett Quote. |
| 9 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-003

**Cél:** Quote létrehozás elvetése

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Egyedi Quote-név; +14 napos lejárat.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap; név és lejárat kitöltése. | A mezőértékek visszaellenőrzöttek. |
| 7 | Cancel; pontos Quote-név keresése. | A dialog bezárul; nincs Quote-találat. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-004

**Cél:** Quote adatok és költségek szerkesztése

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Új név; +45 nap; Unicode leírás; Tax = 12.34; Shipping = 5.67.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 7 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 8 | Edit; új név, lejárat, „Módosított ajánlat: áéőű & text.”, adó és szállítás kitöltése; Save. | A dialog bezárul; új saját név a naplóban. |
| 9 | Friss Details. | Új név, OpportunityName, +45 napos lejárat és pontos leírás; Tax = 12.34; ShippingHandling = 5.67; GrandTotal = 18.01. |
| 10 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-005

**Cél:** Quote szerkesztés elvetése

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Nem mentett név és Accepted.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 7 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 8 | Edit; új név és Status = Accepted; Cancel. | A dialog bezárul. |
| 9 | Friss Details. | Az eredeti Quote Name és Draft Status marad. |
| 10 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-006

**Cél:** Quote Presented → Accepted

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 7 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 8 | Edit; Status = Presented; Save; friss Details. | Status = Presented. |
| 9 | Edit; Status = Accepted; Save; friss Details. | Status = Accepted. |
| 10 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-007

**Cél:** Quote törlés elvetése

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 7 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 8 | Delete dialog megnyitása. | A Delete gomb látható a megerősítő dialogban. |
| 9 | Cancel; friss Details. | Az eredeti Quote Name továbbra is olvasható. |
| 10 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-008

**Cél:** Quote megerősített UI-törlés

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 7 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 8 | Delete dialog; Delete. | A dialog bezárul; UI elnavigál a Quote URL-jéről. |
| 9 | Pontos Quote-név keresése. | Nincs találat; deleted = true a naplóban. |
| 10 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-QUO-009

**Cél:** Terméktétel, összesítés és szinkronizálás

**Forrás:** [tests/quote.e2e.ts](tests/quote.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Saját aktív termék és aktív egyéni Price Book; egységár = 125.50; mennyiség = 2; összeg = 251.00 USD.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | UI-n saját Product létrehozása egyedi név/kóddal, Active jelöléssel; Add Standard Price = 125.50. | A mentések lezárják a dialogot; saját Product ID ismert. A standard árlista globális aktiválását a teszt nem igényli. |
| 3 | UI-n aktív saját Price Book létrehozása; Related → Add Products; pontos terméksor kiválasztása, Next, Save. | Active checkbox jelölt; Price Book Entries (1) és a pontos terméksorban $125.50 látható. |
| 4 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 5 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 6 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 7 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 8 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 9 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 10 | Quote Related → Add Products; saját Price Book ellenőrzése és Save; pontos termék kiválasztása, Next. | A kiválasztott termék checkboxa jelölt; Edit Selected Quote Line Items dialog látható. |
| 11 | Quantity = 2; Tab; Save; friss Details és Related. | Quantity cella 2.00; Subtotal, Total Price, Grand Total = 251.00; Quote Line Items (1); pontos terméklink látható. |
| 12 | Show more actions → Start Sync → Continue. | Dialog bezárul; friss Details: Syncing = true; Opportunity Amount = 251.00, további alapadatok és Sales tulajdonos helyes. |
| 13 | Show more actions → Stop Sync → Continue. | Syncing = false; Quote Subtotal/Total Price/Grand Total és Opportunity Amount marad 251.00. |
| 14 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-ROLE-001

**Cél:** Sales Manager Opportunity tulajdonos és létrehozó

**Forrás:** [tests/roles.e2e.ts](tests/roles.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Friss Details és teljes Opportunity-orákulum. | Opportunity Owner és Created By pontosan E2E Sales Manager; saját Account-link és alapadatok helyesek. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-ROLE-002

**Cél:** Service Manager nem hozhat létre Opportunityt

**Forrás:** [tests/roles.e2e.ts](tests/roles.e2e.ts)

**Szerepkör:** E2E Service Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Service-munkamenet; nincs létrehozott üzleti rekord.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Opportunity listanézet megnyitása. | Search this list vezérlő látható; New gombból 0 darab. |
| 3 | Közvetlen /lightning/o/Opportunity/new UI-navigáció. | Jogosultsághiányról szóló látható üzenet; nincs Save-dialog. |
| 4 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-ROLE-003

**Cél:** Service Manager Case létrehozás és szerkesztés

**Forrás:** [tests/roles.e2e.ts](tests/roles.e2e.ts)

**Szerepkör:** E2E Service Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Case: Subject egyedi; Origin = Phone; Status New → Working; Description = saját név.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Case a saját Account alatt; Subject, New, Phone és Description; Save. | A dialog bezárul; saját Case ID ismert. |
| 5 | Friss Details. | Subject pontosan saját név; Status = New; Created By = E2E Service Manager; saját Description-jelölő és Case Number ellenőrzött. |
| 6 | Edit; Status = Working; Save; friss Details. | Status = Working; saját rekordazonosító és Description-jelölő helyes. |
| 7 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-E2E-001

**Cél:** Sales → Service teljes folyamat

**Forrás:** [tests/integration.e2e.ts](tests/integration.e2e.ts)

**Szerepkör:** E2E Sales Manager → E2E Service Manager → E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Ugyanaz az Account; Quote Accepted; Opportunity Won; Contract Activated, 12 hónap.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Opportunity Stage = Negotiation/Review; Save; friss Details. | Stage és teljes Opportunity-orákulum helyes. |
| 7 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 8 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 9 | Quote Edit; Status = Accepted; Save; friss Details. | Accepted, saját Opportunity Name és Account Name; Opportunity-link a pontos Opportunity ID-jára mutat. |
| 10 | Opportunity Stage = Closed Won; Save; friss Details. | Closed Won, 100%, Salesforce-felhasználó szerinti mai Close Date; alapadatok és kapcsolatok helyesek. |
| 11 | Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel. | A Save és a kitöltött mezők láthatók; az Account előtöltött. |
| 12 | Contract mentése; friss Details megnyitása. | Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül. |
| 13 | Contract Activate és megerősítés; friss Details. | Activated; 12 hónap; ugyanaz az Account; Activated By = Sales Manager; Activated Date kitöltött. |
| 14 | Böngészőállapot törlése; Service JWT-belépés; profil megnyitása és bezárása. | A látható profilnév E2E Service Manager; új Service-munkamenet aktív. |
| 15 | Ugyanazon Contract friss Details megnyitása Service-ként. | Activated státusz, saját Account és Description-jelölő olvasható; Edit és Delete gombból 0 darab. |
| 16 | Finally: új Sales JWT-belépés, profil ellenőrzése; Opportunity friss Details. | E2E Sales Manager aktív; saját Opportunity Closed Won és 100%; takarítás Sales-ként fut. |
| 17 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-AI-001

**Cél:** AI Opportunity szerkesztés

**Forrás:** [tests/agent/sales.e2e.ts](tests/agent/sales.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. Új egyedi név; Amount = 543.21.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Opportunity Edit; agent.act a név és összeg beállítására, Save. | A dialog bezárul; az agent kizárólag UI-n dolgozik. |
| 7 | Determinista friss Details-orákulum. | Új név és 543.21; az összes többi alapadat, Account-link és Sales tulajdonos helyes. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-AI-002

**Cél:** AI Contract szerkesztés és assert

**Forrás:** [tests/agent/sales.e2e.ts](tests/agent/sales.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e. 24 hónap; egyedi Terms.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Új Contract űrlap kitöltése a saját Accounttal, UTC mai Start Date-tel, 12 hónappal, egyedi Description-jelölővel és Unicode Special Terms-szel. | A Save és a kitöltött mezők láthatók; az Account előtöltött. |
| 5 | Contract mentése; friss Details megnyitása. | Draft státusz; helyes Account, Start Date, 12 hónap, Description és Special Terms; Created By: E2E Sales Manager; Contract Number a takarítási naplóba kerül. |
| 6 | Contract Edit; agent.act: term = 24, Special Terms = egyedi érték; Save. | A dialog bezárul. |
| 7 | Determinista friss Details és agent.assert. | 24 hónap, pontos Terms és Draft; az AI a látható Draft státuszt és 24 hónapot is megerősíti. |
| 8 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-AI-003

**Cél:** AI Quote elfogadás és extract

**Forrás:** [tests/agent/sales.e2e.ts](tests/agent/sales.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** Előzetesen konfigurált JWT web-scope és jogosultságok; Salesforce Lightning, en_US felület, Europe/Budapest felhasználói időzóna; egy worker, izolált saját tesztadatok. Standard Quote engedélyezve; az érintett objektumok UI-jogai a szerepkör szerint.

**Tesztadat:** Egyedi E2E-TA- név (időbélyeg + UUID); minden Account és üzleti rekord az aktuális eset saját fixture-e.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör mentett Lightning-munkamenetének visszaállítása. | A JWT-alapú setup UI-n ellenőrzött felhasználója aktív; nem adminisztrátor. |
| 2 | Új Account űrlap megnyitása; egyedi Account Name kitöltése. | A Save gomb és a szerkeszthető Account Name látható; a megadott érték visszaolvasható. |
| 3 | Account mentése és saját rekordoldalának megnyitása. | Az űrlap bezárul; az URL Account-azonosítót tartalmaz; a pontos Account-név címsorként látható. |
| 4 | Az új Opportunity űrlap megnyitása a saját Account előtöltésével; név, +30 napos Close Date, Prospecting, 12345.67 USD és leírás kitöltése. | Az Account Name és a beírt mezőértékek láthatók; a Stage vezérlő Prospecting értéket mutat. |
| 5 | Opportunity mentése; friss rekordoldal Details lapjának megnyitása. | Név, összeg, dátum, Stage és leírás a mentett érték; az Account-link a saját Account ID-jára mutat; Opportunity Owner és Created By: E2E Sales Manager. |
| 6 | Új Quote űrlap megnyitása a saját Opportunityval; egyedi Quote Name, +14 napos lejárat és Unicode leírás kitöltése. | A Save és a beírt mezők láthatók; a saját Opportunity előtöltött. |
| 7 | Quote mentése; friss Details megnyitása. | Draft státusz; helyes Quote Name, Opportunity Name, Account Name és Expiration Date; Created By: E2E Sales Manager. |
| 8 | Quote Edit; agent.act: Accepted és Save. | A dialog bezárul; determinista friss Details: Accepted. |
| 9 | agent.extract a látható Name, Status és Opportunity Name mezőkre, Zod-sémával. | A strukturált objektum pontosan a saját Quote-nevet, Accepted értéket és saját Opportunity-nevet tartalmazza. |
| 10 | A fixture teardown az eset saját naplójának rekordjait függőségi sorrendben, UI-n törli; félkész űrlapot elvet. | Törlés után a rekord URL-jéről elnavigál a UI; a pontos saját név keresésére nincs találat. A napló deleted jelzője csak bizonyított törlés/hiány után igaz. Hiba esetén a napló megmarad célzott UI-helyreállításhoz. |

## SF-AUTH

**Cél:** E2E Sales Manager JWT → Lightning session setup

**Forrás:** [tests/auth.setup.e2e.ts](tests/auth.setup.e2e.ts)

**Szerepkör:** E2E Sales Manager

**Előfeltételek:** ECA Web scope, JWT engedély, felhasználóhoz rendelt preautorizáció; nem szükséges interaktív e-mailkód.

**Tesztadat:** Privát JWT-kulcs, preautorizált kliens és szerepkör-felhasználó; a titkok nem részei a designnak vagy publikus riportnak.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör JWT / singleaccess hitelesítésének indítása; jövőbeli karbantartási értesítésnél a valódi Got it UI-link követése. | A natív Lightning-belépés interaktív kód nélkül lezárul; a token és a beágyazott átirányítási munkamenet-paraméterek redaktáltak. |
| 2 | Opportunity lista és View profile ellenőrzése. | A Search this list látható; New látható; a profilnév pontosan E2E Sales Manager. |
| 3 | session.save('salesforce'). | A hitelesített munkamenet menthető; nincs üzleti adatmódosítás. |

## SF-AUTH-SERVICE

**Cél:** E2E Service Manager JWT → Lightning session setup

**Forrás:** [tests/auth.setup.e2e.ts](tests/auth.setup.e2e.ts)

**Szerepkör:** E2E Service Manager

**Előfeltételek:** ECA Web scope, JWT engedély, felhasználóhoz rendelt preautorizáció; nem szükséges interaktív e-mailkód.

**Tesztadat:** Privát JWT-kulcs, preautorizált kliens és szerepkör-felhasználó; a titkok nem részei a designnak vagy publikus riportnak.

| # | UI-művelet / ellenőrzés | Elvárt eredmény |
| --- | --- | --- |
| 1 | A szerepkör JWT / singleaccess hitelesítésének indítása; jövőbeli karbantartási értesítésnél a valódi Got it UI-link követése. | A natív Lightning-belépés interaktív kód nélkül lezárul; a token és a beágyazott átirányítási munkamenet-paraméterek redaktáltak. |
| 2 | Opportunity lista és View profile ellenőrzése. | A Search this list látható; a profilnév pontosan E2E Service Manager. |
| 3 | session.save('service'). | A hitelesített munkamenet menthető; nincs üzleti adatmódosítás. |
