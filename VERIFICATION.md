# Ellenőrzési bizonyítékok

2026-10-03, Windows PowerShell, Node.js 26.10.0, npm 12.0.2. Cél: `orgfarm-80a620fbaf-dev-ed`. Minden üzleti fixture, folyamat, assertion és cleanup UI-n történt. A token/singleaccess végpontok hitelesítési infrastruktúrát, az admin SDK-hívások egyszeri konfigurációt szolgálnak.

## Végső teljes regresszió

**A javított teljes regresszió: 38 passed, 0 failed**, hét sikeres tesztfájl, exit 0. Futás: `01a0ff02-1689-7d5e-baf6-e44950eca03c`; 2026-10-03 01:45–02:14 Europe/Budapest, CLI teljes idő 28m47s, egy worker, 0 retry, 36 UI-eset + 2 setup. Bizonyíték: `.e2e/report.json`, `.e2e/junit.xml`, `.e2e/summary.md`.

| Blokk | Sikeres eredmények |
| --- | ---: |
| Sales + Service auth setup | 2 |
| Hitelesített UI-lista | 1 |
| Opportunity | 13 |
| Contract | 9 |
| Quote | 9 |
| Sales/Service jogosultságok és Case | 3 |
| Sales → Service integráció | 1 |
| **Összesen** | **38** |

Az Allure ugyanennek a futásnak a 38 eredményét tartalmazza: `allure-report/run-manifest.json` és `summary.json`, source exit 0, 38 passed. Mind a 38 eset leírásában megvan a lépésszintű design; a nyers SDK-adatok lépésszáma egyezik az e2e lépéseivel, minden attempt cleanupja complete. A végső HTML böngészős design-próbája `.validation/report-ui/1790986575117/report.json`: 1 passed. A korábban ellenőrzött failed-harness eredmények nem kerültek a végső riportba.

Az első teljes POM-futás `01a0fede-3b85-7ffd-98f7-87ed0490ec8a`: **36 passed, 2 failed, 38 eredmény**, 28m45s, exit 1. Mind a 9 Contract, 9 Quote, 3 szerepkörteszt és az integráció sikeres. A két Opportunity-hiba (SF-OPP-001/002) a picklist átmeneti aktív opcióját/bezáródását érintette; bizonyíték: `.validation/ui-regression-pom-focus/report.json`. Mindkét valódi failed eset Allure-logja, pontos URL-je és PNG-je külön ellenőrzött; mind a 38 eredmény designja és cleanupja megvan.

A javítás célzott futása `.validation/ui-picker-observed/report.json`, `01a0fef9-d869-7b1a-815a-e23d02bacaeb`: **8 passed, 0 failed**, 6m59s, exit 0. Az életciklus, Opportunity Name/Stage kötelezőség, Quote Presented→Accepted, Service Case és teljes integráció + két auth setup mind sikeres; ez célzott bizonyíték, nem a teljes regresszió helyettesítője.

## Külön ellenőrzött előfeltételek és riportútvonal

| Ellenőrzés | Tényleges bizonyíték |
| --- | --- |
| Két aktív, nem admin persona | E2E Sales Manager / E2E Service Manager saját profil, szerepkör, permission set; kezdeti user UI-setup `.validation/ui-users-fifth/report.json`, 2 passed. |
| Jogosultsági audit | Nincs View All Data / Modify All Data / Manage Users / Customize Application és objektumszintű View All / Modify All. Service Opportunity/Contract readonly; Sales Opportunity Owner/Created By UI-assertion. |
| JWT e-mailkód nélkül | Sales és Service többször sikeres valódi UI-belépés; a natív engine-adapterrel is. Nincs admin fallback vagy org-wide MFA/IP-lazítás. |
| TypeScript | `npm run typecheck`: exit 0 a business, auth, maintenance, POM, AI, reporter és validation forrásokra. |
| Doctor | `npm run doctor`: minden előfeltétel OK; Allure és Netlify CLI is telepített. |
| OAuth infrastructure | `npm run test:unit`: 7 passed, 0 failed. |
| Auth / ShadowRoot UI harness | `.validation/auth-harness/1790982345801/report.json`: 3 passed; Secret-fallback és natív belépés, screenshot lehetősége, token-canary nélküli összes szöveges report. Minden hálózati kérés szintetikus. |
| Allure failed-evidence harness | `.validation/allure-failure-harness/1790982349913/report.json`: a várt 1 failed UI-assertion. A wrapper exit 0: Allure failed-státusz, hibás lépés részletei, teljes log, pontos URL, automatikus PNG-signature és tokenmentesség igazolt. Nem része az üzleti regressziónak. |
| Allure failed HTML UI | `.validation/report-ui/1790986682184/report.json`: 1 passed; a korábbi valódi, 38 eredményes futás SF-OPP-001 failed tesztjének Detailed attempt log / Failure URL / Screenshot at failure mellékletei Chromiumban ténylegesen láthatók. A szintetikus canary-report korábbi UI-próbája is sikeres: `.validation/report-ui/1790982299420/report.json`. |
| Allure test design UI | `.validation/report-ui/1790984704263/report.json`: 1 passed; a valódi, 38 eredményes Allure-report SF-OPP-001 leírásának iframe-jében a szerepkör, preconditions, data, expected lépések és cleanup ténylegesen látható. |
| POM-réteghatár | `npm run pom:check`: mind a 7 business tesztforrás közvetlen UI-szelektor/DOM-evaluation/fetch/fix várakozás nélkül. Részletek: POM_REVIEW.md. |
| Test design | `npm run design:check`: 41 design, 321 lépés; egyezés az e2e tényleges normál/AI test collection azonosítóival és forrásfájljaival. |
| Picklist célzott próba | `.validation/ui-picker-focus-probe/report.json`: 2 passed (auth + UI-próba). Stage többirányú váltások, --None--, Presented/Accepted/Denied/Draft UI-választások és saját UI-takarítás. |
| GitHub Actions syntax | actionlint 1.7.12: exit 0 a `.github/workflows/salesforce-regression.yml` fájlra. A távoli workflow első ellenőrzése a repository feltöltése után történik. |
| Git feltöltési jelöltek | 75 forrásfájl: nincs konfigurált credential value vagy privát PEM-blokk. `.env`, auth/session/report/journal/böngésző/Netlify mappák ignore-ellenőrzése sikeres. A feltöltés előtt újra ellenőrzött források; hitelesítési anyag nincs a commitban. |
| Netlify | Sikeres production deploy: [élő Allure](https://sf-e2e-tst-allure-ak91hu.netlify.app), a helyi 38/38 passed futás manifestjével. Saját `ak91hu` team; hat Actions secret beállítva. |
| Opcionális AI | 3 UI-eset megírva, typecheckelt és designt kapott. A modellkvóta kimerült; élő siker nincs igazolva. |

## Korábbi hibák és javítások

Az átszervezés előtti teljes futás `.validation/ui-regression-before-pom/report.json`: **37 passed, 1 failed, 38 eredmény**, 33m40s; a Quote-elvetési eset Opportunity-előkészítésében egy záródó Stage-popup nem lett kiválasztva. Ez nem teljesen zöld eredmény.

A POM-átalakítás utáni célzott futások további okokat mutattak: UTC és budapesti napi dátum eltérése Closed Won-nál; az edit form egyes változatai nem támogatják stabilan a Home billentyűt; a globális billentyűesemény helyett a konkrét comboboxra célzott esemény szükséges. Az első teljes POM-futás azt is megmutatta, hogy a fókusz/validáció frissítése bezárhatja a listát vagy visszaállíthatja az aktív opciót. A végső kód minden lépésnél a tényleges UI-állapotból indul, natív ArrowDown/Enterrel, pontos cél-ID feltételével; nincs előre feltételezett index, koordinátás kényszerkattintás vagy fix sleep. A closing dialog eltűnését cleanup előtt kivárja.

Az Allure kezdeti string mellékletét a hivatalos SDK fájlútnak értelmezte; Buffer-mellékletre javítottuk. Az e2e 0.15.1 publikus `browser.goto` későn regisztrált tokenes címkéjét a hitelesítési adapter engine-beli `session.open` művelete váltotta fel. A szintetikus canary-ellenőrzés bizonyítja a javított jelentés tokenmentességét; a korábbi recovery report auth URL-jei helyben redaktálva lettek.

A régi, megszakadt vagy failed futások saját adatnaplóit célzott UI-recovery rendezte; nincs előtag szerinti tömeges törlés vagy hard purge. A korábbi két fennmaradó Account/félkész Opportunity takarítása `.e2e/recovery/report.json`: 2 passed. A végső futás után az összes `.e2e-data/*.json` napló ellenőrzött: **0 pending napló / 0 fennmaradó saját rekord**.

## Publikálási kompatibilitás

TypeScript 6.0.3 rögzítve: a Netlify CLI 27.10.2 compiler API-t használó függősége TypeScript 7 alatt a deploy előtt hibával leállt. A kompatibilis verzióval a typecheck és a production deploy sikeres. Az üzleti tesztforrás és a böngészős runtime nem változott.

## Első GitHub runner és javítás

[Az első Actions-futás](https://github.com/ak91hu/sf-e2e-tst/actions/runs/37100779188) source/report ellenőrzései sikeresek, de mindkét auth setup a Salesforce jövőbeli karbantartási értesítőoldalán megállt: 2 failed, 36 skipped. A valódi Got it UI-link kezelése és a beágyazott SID/contentDoor URL-paraméterek engine-beli redakciója hozzáadva. Az érintett napló, artifact, history cache és korábbi Netlify-deploy eltávolítva; az érintett UI-sessionök logoutja elvégezve.

Javítás utáni ellenőrzés: typecheck sikeres; 9 unit passed; auth/shadow harness 4 passed (`.validation/auth-harness/1791006813567/report.json`); két várt failed-evidence canary, wrapper exit 0 (`.validation/allure-failure-harness/1791007038891/report.json`). Az utóbbi a nested auth URL redakcióját, logját és automatikus PNG-jét is igazolja. Élő célzott login/lista: 2 passed (`.validation/ui-auth-maintenance/report.json`). A Netlifyon publikált HTML design UI-próbája: 1 passed (`.validation/report-ui/1791006386873/report.json`).

## Megismétlés

```powershell
npm run doctor
npm run typecheck
npm run test:unit
npm run pom:check
npm run design:check
npm run test:auth-harness
npm run test:evidence-harness
npm run test:regression
npm run report
npm run allure:generate
```

Konfiguráció: [AUTH_SETUP.md](AUTH_SETUP.md), test design: [TEST_DESIGN.md](TEST_DESIGN.md), CI/publikálás: [GITHUB_NETLIFY.md](GITHUB_NETLIFY.md). A végső HTML és a report run ID-jának egyeznie kell; más futások eredményét nem összesítjük sikernek.
