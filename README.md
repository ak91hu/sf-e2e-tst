# Salesforce Opportunity, Contract és Quote UI-regresszió

[![TesterArmy e2e](https://img.shields.io/badge/TesterArmy_e2e-0.15.1-6547c2)](https://tester.army/e2e)
[![Web engine](https://img.shields.io/badge/e2e_Web_engine-0.11.1-6547c2)](https://github.com/tester-army/e2e)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-26-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.63.0-2ead33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Allure](https://img.shields.io/badge/Allure_Report-3.20.0-e84659)](https://allurereport.org/)
[![Allure SDK](https://img.shields.io/badge/Allure_JS_SDK-3.13.0-e84659)](https://github.com/allure-framework/allure-js)
[![Zod](https://img.shields.io/badge/Zod-4.6.1-3e67b1?logo=zod&logoColor=white)](https://zod.dev/)
[![AI SDK](https://img.shields.io/badge/AI_SDK-7.0.107-111111)](https://ai-sdk.dev/)
[![Netlify](https://img.shields.io/badge/Netlify_CLI-27.10.2-00c7b7?logo=netlify&logoColor=white)](GITHUB_NETLIFY.md)
[![GitHub Actions](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml/badge.svg)](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml)
[![Salesforce](https://img.shields.io/badge/Salesforce-Lightning-00a1e0?logo=salesforce&logoColor=white)](https://developer.salesforce.com/)
[![Salesforce CLI](https://img.shields.io/badge/Salesforce_CLI-2.152.14-00a1e0?logo=salesforce&logoColor=white)](AUTH_SETUP.md)
[![UI tests](https://img.shields.io/badge/Business_tests-100%25_UI-success)](TEST_DESIGN.md)

Automatizált regresszió a [TesterArmy e2e](https://tester.army/e2e) keretrendszerrel, TypeScripttel és Chromiummal. **Mind a 36 alapregressziós eset UI-teszt:** a fixture-rekordok létrehozása, a folyamatlépések, a mentett adatok ellenőrzése és a takarítás is a Salesforce Lightning felületén történik. Nincs üzleti REST/SOQL-orákulum, API-s adatgenerálás vagy üzleti válaszmockolás.

Az Opportunityt **E2E Sales Manager** hozza létre és birtokolja. A UI-assertion minden Opportunity fixture-ben ellenőrzi az Owner és Created By személyt. **E2E Service Manager** külön munkamenettel vizsgálja a jogosultságokat és a folyamatátadást; saját Case-t is létrehoz és szerkeszt. Az admin kizárólag az egyszeri konfigurációhoz és elkülönített, pontos saját maintenance-takarításhoz használható.

Az Allure részletes lépéslistát, test designokat és failed esetekhez **teljes hibakeresési logot, automatikus PNG-t és a konkrét hibakori URL-t** ad. A GitHub Actions az aktuális statikus HTML-riport **Netlifyra** publikálására konfigurált. Repository: [ak91hu/sf-e2e-tst](https://github.com/ak91hu/sf-e2e-tst). Élő riport: [Allure a Netlifyon](https://sf-e2e-tst-allure-ak91hu.netlify.app).

**Legutóbbi teljes élő ellenőrzés: 38/38 passed**, 2026-10-03, 36 UI-eset + 2 setup, egy worker, nulla retry, 28m47s. Futás: `01a0ff02-1689-7d5e-baf6-e44950eca03c`; nincs fennmaradó saját tesztadat. A generált `allure-report/index.html` és a design megjelenítése Chromiumban is ellenőrzött. A riport Netlify production publikálása sikeres; a távoli GitHub Actions első ellenőrzése a feltöltést követően történik.

## Dokumentáció és ellenőrzési állapot

| Dokumentum | Tartalom |
| --- | --- |
| [TEST_DESIGN.md](TEST_DESIGN.md) | **41 test design, 321 kibontott lépés:** cél, szerepkör, előfeltételek, tesztadat, UI-művelet, elvárt eredmény és takarítás. |
| [POM_REVIEW.md](POM_REVIEW.md) | Page Object Model felépítés, ellenőrzési megállapítások és javítások. |
| [AUTH_SETUP.md](AUTH_SETUP.md) | JWT, egyszeri Salesforce-konfiguráció, két persona és e-mailkód nélküli futás. |
| [GITHUB_NETLIFY.md](GITHUB_NETLIFY.md) | GitHub secrets, Actions, Allure history, Netlify site és publikálás. |
| [VERIFICATION.md](VERIFICATION.md) | A tényleges élő futások, eredmények, bizonyítékok és korlátok. |

A komponensbadge-ek rögzített verziókat jelölnek; az Actions badge a legutóbbi távoli workflow állapotát mutatja. A futás aktuális eredményét a VERIFICATION.md és az Allure mutatja. A három opcionális AI-eset elkészült és typecheckelt; élő sikerüket a rendelkezésre álló modellkvóta kimerülése miatt nem állítjuk.

## Gyors indítás

Node.js **26 ajánlott**, minimum 24; npm és egy letöltött Playwright Chromium szükséges. Allure 3 Java nélkül, Node.js-en fut. A célorg ezen a gépen már konfigurált. Új gépen a `.env.example` másolatából állítsd be a két persona felhasználónevét, a Consumer Key-t és biztonságosan a privát JWT-kulcsot.

```powershell
npm ci --no-audit --no-fund
npm run install:browsers
npm run doctor
npm run typecheck
npm run pom:check
npm run design:check
npm run test:regression
npm run report
npm run allure:generate
npm run allure:open
```

Linux/CI környezetben: `npm run install:browsers -- --with-deps`. A projekt a `.browsers` mappába telepíti a böngészőt. A `doctor` előfeltételeket ellenőriz, üzleti tesztet nem futtat és titkokat nem ír ki.

Az alapregresszió **modell és modellkulcs nélkül** fut. A Salesforce JWT → Single Access → natív frontdoor belépés friss Lightning-munkamenetet nyit, jelszó és ismétlődő e-mailkód nélkül. Hiányzó előengedélyezés vagy interaktív hitelesítési kényszer esetén a futás hibát jelez; nem vár e-mailkódra.

## Felhasználók és jogosultságok

Cél: `https://orgfarm-80a620fbaf-dev-ed.develop.my.salesforce.com`.

| Persona | Felhasználónév | Jogosultság |
| --- | --- | --- |
| E2E Sales Manager | `e2e.sales.manager.00dgk00000blbthuac@example.invalid` | Account, Contact, Opportunity, Contract, Quote, Product, Price Book CRUD; Contract aktiválás és aktivált saját tesztszerződés törlése. |
| E2E Service Manager | `e2e.service.manager.00dgk00000blbthuac@example.invalid` | Account, Contact, Case CRUD; Opportunity és Contract olvasás; Opportunity létrehozás tiltott. |

Mindkét persona aktív, saját minimális profillal, szerepkörrel és permission settel. Nincs View All Data, Modify All Data, Manage Users, Customize Application vagy objektumszintű View All / Modify All joguk. A Contract-aktiválás Salesforce-függősége miatt a Sales Manager Order olvasási/szerkesztési jogot kapott, Order create/delete jogot nem. A négy Salesforce-licenc foglalt; meglévő felhasználót nem deaktiváltunk.

Az `SF_USERNAME` a konfigurációs admin; az üzleti felhasználó `SF_SALES_USERNAME`. Nincs admin fallback. A business session setup az admin azonosítóját visszautasítja, és az Opportunity New művelet külön guardot tartalmaz. Az integráció a profilmenüben ellenőrzi a tényleges Sales/Service személyt is.

## Környezeti beállítások

| Változó | Jelentés |
| --- | --- |
| `SF_BASE_URL` | Developer Edition My Domain origin; HTTPS, path/query nélkül. A jelenlegi validáció `*.develop.my.salesforce.com` orgra korlátozott. |
| `SF_SALES_USERNAME`, `SF_SERVICE_USERNAME` | A két előengedélyezett üzleti felhasználó. |
| `SF_CLIENT_ID` | A JWT-képes External Client App Consumer Key-je. Consumer Secret nem kell. |
| `SF_JWT_PRIVATE_KEY_FILE` | Helyi RSA PEM-kulcs; alapértelmezett munkafájl `.e2e-auth/jwt.key`. |
| `SF_JWT_PRIVATE_KEY` | CI-ben teljes multiline PEM a repository secretből; fájl helyett használható. |
| `SF_JWT_AUDIENCE` | Ezen a Developer Editionön `https://login.salesforce.com`. Más orgtípus illesztését az AUTH_SETUP írja le. |
| `SF_TIME_ZONE` | A persona Salesforce-időzónája; alapértelmezés `Europe/Budapest`. |
| `SF_OPPORTUNITY_RECORD_TYPE` | Opcionális Opportunity record type ID. |
| `SF_STAGE_*`, `SF_WON_PROBABILITY`, `SF_LOST_PROBABILITY` | A saját sales process és százalékok; példaértékek `.env.example`-ben. |
| `NETLIFY_SITE_ID`, `NETLIFY_AUTH_TOKEN` | Saját Allure report site és CI Netlify-hitelesítés. Helyben CLI-login használható. |

Az `.env` helyi; a meglévő process/CI változók elsőbbséget kapnak. A tanúsítvány jelenlegi lejárata **2027-10-02**. Új orgon az alkalmazás, profilok, permission setek, QuoteSettings és két felhasználó egyszeri provisioningje szükséges; az [AUTH_SETUP.md](AUTH_SETUP.md) részletezi. A konfigurációs SDK/CLI-hívások nem részei az üzleti teszteknek.

## Lefedettség

| Azonosítók | Darab | Viselkedés |
| --- | ---: | --- |
| SF-AUTH-001 | 1 | Hitelesített Opportunity lista és New gomb. |
| SF-OPP-001–013 | 13 | Prospecting → Qualification → Proposal → Negotiation → Closed Won; kötelező név/dátum/Stage; Unicode szerkesztés; Cancel create/edit/delete; Closed Lost és újranyitás; UI-törlés; 0 és 0.01 USD. |
| SF-CON-001–009 | 9 | Draft; Account, dátum, 12 hónap; kötelező Account/Start Date/term; Unicode feltételek és 24 hónap; Cancel; UI-törlés; aktiválás, aktiváló személy és dátum. |
| SF-QUO-001–009 | 9 | Draft; Opportunity/Account kapcsolat és lejárat; kötelező név; Cancel; Unicode/adó/szállítás/Grand Total; Presented → Accepted; UI-törlés; saját katalógus, 2 × 125.50 = 251.00 USD; Start/Stop Sync és Opportunity Amount. |
| SF-ROLE-001–003 | 3 | Sales Owner/Created By; Service Opportunity-létrehozás tiltása listán és közvetlen New URL-en; Service Case New → Working. |
| SF-E2E-001 | 1 | Sales Opportunity → Accepted Quote → Closed Won → Activated Contract → Service readonly átadás → vissza Sales-ra. |
| SF-AUTH, SF-AUTH-SERVICE | +2 setup | Külön JWT-belépés, profilbizonyíték és mentett UI-session; a kiválasztott tesztek függőségeiként futnak. |
| SF-AI-001–003 | +3 opcionális | Természetes nyelvű Opportunity/Contract/Quote UI-módosítás, assert és strukturált extract, determinisztikus orákulummal. |

Teljes normál futás: **36 eset + 2 setup = 38 eredmény**. A 41 design az opcionális AI-eseteket is tartalmazza. Szűrt futásnál az Allure csak a ténylegesen kiválasztott eseteket/setupokat exportálja; a többi eset nem növeli mesterséges skipped eredményekkel a riportot.

**Adatmodell:** standard Quote, nem CPQ. A standard Contract ebben az orgban az **Accounton** keresztül kapcsolódik a folyamathoz; nincs Opportunity.ContractId. Az integráció ugyanazt az Accountot és pontos Opportunity-linket vizsgálja.

**Dátumok:** a beírt relatív tesztdátumok UTC-alapúak. Closed Won mentéskor a Salesforce a jövőbeli Close Date-et a **felhasználó mai dátumára** változtatja. A teszt a mentés előtti/utáni napot az `SF_TIME_ZONE` időzónában számolja, így az UTC és a budapesti éjfél különbsége is kezelhető.

## Futási parancsok

| Parancs | Feladat |
| --- | --- |
| `npm run test:list` | Esetek és setupok felsorolása, böngésző nélkül. |
| `npm run test:regression` | Teljes alapregresszió. |
| `npm run test:opportunity` / `test:contract` / `test:quote` | Objektum szerinti UI-regresszió. |
| `npm run test:roles` / `test:integration` | Szerepkörök / teljes folyamatátadás. |
| `npm run test:auth` / `test:smoke` | Belépési / smoke szelekció. |
| `npm run test:e2e -- --grep SF-OPP-006` | Pontos eset vagy regex szerinti választás. |
| `npm run test:headed` | Látható tesztböngésző. |
| `npm run test:last-failed` | A korábbi report sikertelen eseteinek célzott futtatása. |
| `npm run report` | Aktuális e2e összegzés; a regression exit code-ot adja vissza. |
| `npm run allure:generate` | Aktuális befejezett futásból statikus Allure HTML. |
| `npm run allure:open` | Allure HTML helyi szerveren, böngészőben. |
| `npm run allure:deploy` | Az aktuális HTML Netlify production publikálása. |

Egy worker, **0 retry**; 10 perces esethatár, 45 másodperces akciókeret, 30 másodperces assertion, 5 perces takarítási keret. Ne indíts párhuzamos élő futást ugyanarra az orgra. Az esetek saját adatot és izolált böngészőállapotot kapnak; a setup-sessionök a deklarált függőségek szerint állnak helyre.

## Page Object Model és keretrendszerhasználat

```text
tests/                 üzleti folyamatok és elvárt eredmények
pages/                 Account, Opportunity, Contract, Quote, Service, Catalog
pages/components/      picklist és Quote Line Items wizard
support/sales-ui.ts    közös appnavigáció, űrlap, Details, olvasás és UI-törlés
support/core-fixtures  esetenkénti POM és finally takarítás
support/auth-engine    engine-ben tartott JWT/frontdoor hitelesítés
reporting/allure.ts    e2e → hivatalos Allure reporter SDK adapter
docs/test-design.ts    szerkeszthető lépésdesignok
scripts/               futtatás, riport, provisioning és helyreállítás
maintenance/           kezdeti user UI-setup és pontos saját recovery
validation/            külön infrastruktúra/Allure böngészős ellenőrzések
unit/                  kriptográfiai/hitelesítési infrastructure ellenőrzések
```

Az üzleti tesztekben nincs közvetlen `getBy*` szelektor, DOM evaluation vagy `fetch`. A POM friss navigáció után látható Details mezőket, pontos rekordlinkeket és listakeresést olvas; nem nyúl alkalmazásállapothoz. A picklist az adott comboboxra célzott natív billentyűkkel választ; minden lépésnél a tényleges aktív opciót olvassa, és csak a cél ID-jánál nyom Entert. A még nem mentett választást a form fókusz/validációs frissítéséhez igazítja. Nincs fix várakozás vagy kényszerített kattintás. `npm run pom:check` őrzi a réteghatárt; a [POM_REVIEW](POM_REVIEW.md) részletezi.

A keretrendszer session setup-függőségeit, saját fixture-eit, automatikusan várakozó szemantikus locátorait, `expect.poll` assertionjeit, tageket, célzott futtatást, model-free web engine-t és custom reportert használjuk. A pinned web engine 0.11.1 Salesforce synthetic ShadowRoot IDREF-kompatibilitási javítását a `postinstall` pontos verzió-/forrásellenőrzéssel alkalmazza; a Document viselkedése változatlan. Külön shadow-DOM harness ellenőrzi ezt.

## Test designok karbantartása

Minden eset saját táblázata kibontva tartalmazza az előkészítés és takarítás lépéseit is. A [docs/test-design.ts](docs/test-design.ts) a szerkeszthető forrás; a Markdown generált, az Allure-leírások ugyanebből készülnek.

```powershell
npm run design:generate
npm run design:check
```

A check az e2e tényleges test collectionjén is összeveti az azonosítókat és forrásfájlokat: minden normál/AI esethez és auth setuphoz kell design, és nem maradhat futtathatatlan design. Új assertion vagy folyamatlépés esetén a design elvárt eredményét is frissítsd.

## Allure riport és hibakeresés

| Kimenet | Tartalom |
| --- | --- |
| `.e2e/report.json`, `junit.xml`, `summary.md` | Eredeti e2e eredmény, lépések és összegzés. |
| `.e2e/allure-results/<run-id>` | Egyetlen tényleges futás Allure SDK eredményei. |
| `.e2e/allure-results/current.json` | Aktuális run ID, kiválasztott esetek és exportált eredményfájlok száma. |
| `allure-report/index.html` | Önálló statikus Allure 3 HTML, beágyazott adat és mellékletek. |
| `allure-report/run-manifest.json` | A publikált futás ID-ja és eredeti exit code-ja. |
| `test-history/history.jsonl` | Allure trend/history; CI cache őrzi az előző futásokat. |

Failed esetnél a teszt részleteiben:

- **Test body:** API, locátor, időtartam, státusz, hibakód és elvárt/tényleges érték.
- **Detailed attempt log:** minden végrehajtási lépés/esemény, elsődleges és másodlagos hiba, időzítés és cleanup.
- **Failure URL / URL at failure:** a konkrét hibakori oldal URL-je, a takarítás előtti állapotból.
- **Screenshot at failure:** a framework által automatikusan rögzített PNG az üzleti UI-ról.
- **Redacted UI evidence:** szemantikus felületi napló, ha a framework rendelkezésre bocsátja.
- **Description:** az adott eset célja, szerepköre, tesztadata és lépésenkénti elvárt eredménye.

A titkok az engine-ben maradnak; a credential URL nem lesz publikus `browser.goto` naplóbejegyzés. A framework eredeti Secret-fill képvédelmét nem kerüljük meg: egyszeri jelszó-bootstrap után a képek elnyomottak. Böngészőindítás előtti infrastruktúrahibához nincs UI-screenshot. Trace/video kikapcsolt. Az Allure-adapter csak a saját futás teljesen redaktált evidence fájljait csatolja.

Az `allure:generate` ellenőrzi az aktuális report és results run ID-ját és darabszámát; nincs régi eredmények összekeverése. A szintetikus/diagnosztikai HTML-futások külön historyt használnak, így nem torzítják a regresszió trendjét.

## Netlify és GitHub Actions

A workflow: [.github/workflows/salesforce-regression.yml](.github/workflows/salesforce-regression.yml). PR-en credential nélküli source/POM/design/auth/evidence ellenőrzések futnak. A default branch forráskód-push, kézi futás és hétköznapi **02:00 UTC** schedule indítja az élő regressziót. Közös concurrency-csoport védi az orgot a párhuzamos CI-futásoktól.

**A sikertelen regresszió piros marad**, de a befejezett aktuális eredményből Allure készül és Netlify-deploy fut. A report linkje a Step Summaryban jelenik meg. Az artifact az eredeti reportot, redaktált evidence-et, Allure-t és pontos recovery-naplókat 14 napra menti; session-state, kulcs és authállomány nincs benne.

Kötelező GitHub repository secrets: `SF_SALES_USERNAME`, `SF_SERVICE_USERNAME`, `SF_CLIENT_ID`, `SF_JWT_PRIVATE_KEY`, **`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`**. A saját Netlify site beállítása és a részletes műveleti útmutató: [GITHUB_NETLIFY.md](GITHUB_NETLIFY.md). A helyi publikáló kizárólag a négy generált statikus fájlt és az aktuális futást fogadja el; `--no-build` mellett nem fut új Salesforce-tesztet.

Az `.env`, kulcsok, auth, sessionök, böngészők, helyi riportok, journalok és Netlify-konfiguráció Gitből kizártak. Mind a hat repository secret és a tizenegy szükséges konfigurációs variable beállítva. Kézi indítás: [Actions → Salesforce UI regression and Netlify Allure → Run workflow](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml). A csak Markdown-dokumentációt érintő push nem indít új élő futást.

## Tesztadatok és helyreállítás

Save előtt minden saját adat `E2E-TA-` egyedi nevet és `.e2e-data` naplóbejegyzést kap. A fixture `finally` ágában UI-törlés történik: Quote → Contract → Opportunity → Case → Price Book → Product → Account. A delete és az eltűnési UI-assertion után lesz `deleted: true`; cleanup-hiba megbuktatja az esetet.

Megszakadás után csak pontos naplófájlokból, UI-n lehet helyreállítani:

```powershell
npm run data:recover -- .e2e-data/E2E-TA-attempt-<azonosító>.json
```

Nincs előtag szerinti válogatás nélküli törlés, más rekordok módosítása vagy Recycle Bin hard purge. A recovery idempotens: hiányzó rekordhoz korábbi sikeres UI-törlési napló, pontos név/típus Recycle Bin bizonyíték vagy frissen UI-n igazolt standard szülőtörlés kell. A Case-napló Service sessionnel takarítódik. A journalból származó objektum, origin, név és rekord-ID validált.

## Opcionális AI UI-esetek

```powershell
# Saját ChatGPT modell-hozzáférés és kvóta esetén egyszer:
npm exec -- e2e login openai
npm run test:ai
```

Alternatíva saját gateway-kulccsal: `E2E_MODEL_PROVIDER=gateway`, megfelelő `E2E_MODEL`, `AI_GATEWAY_API_KEY`. A három opcionális eset `agent.act`, `agent.assert`, Zod-sémás `agent.extract`, `unique(...)` cache-paramétereket és kizárólag UI-bizonyítékot olvasó project toolt használ. A konfiguráció cache read/write; a dinamikus saját rekordnév nem rontja el a lépés újrahasználhatóságát. Az AI-végrehajtás után minden üzleti állítást determinisztikus, friss UI-ellenőrzés követ.

A modellkvóta kimerülése miatt az AI-ág élő sikerét még nem igazoltuk. Ez nem akadályozza a normál, model-free regressziót vagy az Allure/Netlify-riportot.

## Infrastruktúra-ellenőrzések

```powershell
npm run test:unit
npm run test:auth-harness
npm run test:evidence-harness
# Generált Allure HTML megnyitásának UI-ellenőrzése:
npm run test:report-ui
```

A kilenc unit teszt JWT-aláírást, claims-et, audience/origin és URL-védelmet, replay ID-t és titokmentes hibákat ellenőriz. A négy szintetikus böngészős auth/shadow teszt minden kérést elfog; nem lép be a Salesforce-ba. Az evidence harness két elkülönített UI-esetet szándékosan megbuktat, majd ellenőrzi a failed Allure-státuszt, részletes logot, pontos URL-t, automatikus PNG-t és a beágyazott hitelesítési URL-ek tokenmentességét. A wrapper ezek sikeres bizonyítása esetén ad exit 0-t; ez nem zöldre átírt üzleti teszt, és nem része a publikált regressziós reportnak.

A report UI harness a már generált `allure-report/index.html` fájlt helyi HTTP-kiszolgálón, Chromiumban nyitja meg. Egy sikeres üzleti eset designjának megjelenítése külön is ellenőrizhető: `npm run test:report-ui -- allure-report/index.html "SF-OPP-001 | Létrehozás → Qualification → Proposal → Negotiation → Closed Won" --design`. A Salesforce-regresszió és ez a riportpróba ezen a gépen egymás után fusson.

Ezek az infrastructure ellenőrzések az üzleti tesztkészlet futtató- és riportútvonalát validálják; Salesforce üzleti API-t nem tesztelnek. Az élő sandbox állapotát kizárólag a UI-regresszió bizonyítja.

## Elsődleges források

- [TesterArmy e2e repository](https://github.com/tester-army/e2e) és [hivatalos dokumentáció](https://e2e.tester.army/docs).
- [Playwright Page Object Model](https://playwright.dev/docs/pom).
- [Allure JS SDK](https://github.com/allure-framework/allure-js/blob/main/packages/allure-js-commons/README.md), [Allure 3 konfiguráció](https://allurereport.org/docs/v3/configure/) és [generálás](https://allurereport.org/docs/v3/generate-report/).
- [Netlify CLI és publikálás](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/).
- [Salesforce JWT bearer](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_jwt_flow_ca.htm&language=en_US&type=5), [Single Access UI Bridge](https://help.salesforce.com/s/articleView?id=sf.frontdoor_singleaccess.htm&language=en_US&type=5), [Combobox](https://developer.salesforce.com/docs/platform/lightning-component-reference/guide/lightning-combobox.html).
