# GitHub Actions és Netlify Allure

Repository: [ak91hu/sf-e2e-tst](https://github.com/ak91hu/sf-e2e-tst), tulajdonos és commit-szerző: `ak91hu`, alapértelmezett branch: `main`. A GitHub Actions futtatja az UI-regressziót, a Netlify a generált statikus Allure HTML-t szolgálja ki.

**Aktuális állapot:** helyben 38/38 passed; a végső Allure HTML böngészőben ellenőrzött és production környezetben publikált: [sf-e2e-tst-allure-ak91hu.netlify.app](https://sf-e2e-tst-allure-ak91hu.netlify.app). A saját `ak91hu` Netlify-team oldalának ID-ja: `670d4c13-feb9-4337-8fc9-f628f7c8867e`. Mind a hat GitHub secret és a tizenegy konfigurációs variable beállítva. A távoli workflow ellenőrzése a feltöltést követően történik.

## Repository beállítása és karbantartása

1. A repository már létezik: `ak91hu/sf-e2e-tst`, default branch: `main`.
2. Töltsd fel az ellenőrzött forrásokat és `package-lock.json`-t. Az `.env`, `.e2e-auth`, `.e2e`, `.e2e-data`, `.validation`, `.browsers`, `.netlify`, `node_modules`, report/history könyvtárak kizártak.
3. A repository Settings → Secrets and variables → Actions alatt az alábbi hat titok már beállítva. Kulcsrotációkor itt frissítsd őket.

| GitHub secret | Tartalom |
| --- | --- |
| `SF_SALES_USERNAME` | A Sales Manager felhasználóneve. |
| `SF_SERVICE_USERNAME` | A Service Manager felhasználóneve. |
| `SF_CLIENT_ID` | Az előengedélyezett ECA Consumer Key-je. |
| `SF_JWT_PRIVATE_KEY` | Teljes RSA privát PEM, valódi sortörésekkel; nem fájlútvonal. |
| `NETLIFY_AUTH_TOKEN` | A riportoldalt birtokló fiók Netlify hozzáférési tokenje. |
| `NETLIFY_SITE_ID` | A kívánt Netlify report site azonosítója. |

Az admin jelszava, e-mailkód és AI-kulcs nem szükséges. Beállított repository variables (11): `SF_BASE_URL`, `SF_JWT_AUDIENCE`, `SF_TIME_ZONE`, `SF_STAGE_INITIAL`, `SF_STAGE_QUALIFIED`, `SF_STAGE_PROPOSAL`, `SF_STAGE_NEGOTIATION`, `SF_STAGE_WON`, `SF_STAGE_LOST`, `SF_WON_PROBABILITY`, `SF_LOST_PROBABILITY`. Az `SF_OPPORTUNITY_RECORD_TYPE` opcionális, jelenleg üres.

## Netlify report site

A külön statikus report site a saját `ak91hu` Netlify-teamhez tartozik. Git-integráció és automatikus Netlify-build helyett az Actions publikálja a kész HTML-t. Helyi bejelentkezés: `npm exec -- netlify login`. A site azonosítója a Netlify Project configuration → General → Project information részben található; ezt tedd a CI secretbe és helyben szükség esetén az `.env`-be. A helyi OAuth-token az operációs rendszer Netlify CLI konfigurációjába kerül, nem a projektbe.

```powershell
npm run test:regression
npm run allure:generate
npm run allure:open
# A NETLIFY_SITE_ID beállítása és Netlify-bejelentkezés után:
npm run allure:deploy
```

Az `allure:deploy` a már létrehozott, aktuális futáshoz tartozó HTML-könyvtárat publikálja `--prod --no-build` opciókkal. Az aktuális e2e report és a HTML run manifest azonosítójának egyeznie kell; csak a négy generált publikus fájl engedélyezett. Nem futtat Salesforce-provisioningot, nem tölt fel teljes workspace-t, authot, session-state-et vagy recovery-naplót. A `netlify.toml` a `allure-report` publish könyvtárat és a HTTP-headereket rögzíti.

## Workflow működése

| Trigger / lépés | Működés |
| --- | --- |
| Pull request | Credential nélküli typecheck, OAuth unit, POM/design audit, szintetikus auth és failed-evidence harness. Fork PR nem kap Salesforce- vagy Netlify-titkot. |
| Forráskód-push `main`, kézi futás a default branchen, hétköznap 02:00 UTC | A source check után egy workerrel, nulla retry-val élő Salesforce-regresszió. Az org futásai közös concurrency-csoportban sorba állnak. |
| Sikertelen üzleti teszt | A regression step és a job piros marad. Ettől függetlenül a befejezett aktuális eredményből Allure HTML készül és Netlifyra kerül. |
| Report hiba / hiányzó eredmény | A build/deploy hibát jelez; régi vagy üres riport nem kerül publikálásra. |
| Allure history | Az előző JSONL history visszatöltése Actions cache-ből, majd az új history mentése egyedi run kulccsal, 20 history-bejegyzéses korláttal. A cache nem tartalmaz hitelesítési adatot. |
| Artifact | JSON/JUnit/Markdown, redaktált evidence, nyers Allure results, HTML és pontos recovery-naplók, 14 napos megőrzéssel. Külön felsorolt könyvtárak; a session/auth mappák kizártak. |
| Link | A sikeres deploy a Netlify report linkjét a job Step Summaryba írja. |

A csak Markdown-fájlokat módosító push nem indít élő futást; a kézi indítás mindig elérhető az [Actions workflow oldalán](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml).

A TypeScript 6.0.3 rögzítése a Netlify CLI függőségeinek compiler API-kompatibilitását biztosítja; TypeScript 7 alatt a `ts-api-utils` betöltése a deploy előtt hibával leállt. [Hivatalos compiler API útmutató](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API).

Az időzített futás hétköznapokon, budapesti időben télen 03:00, nyáron 04:00 indul. Az élő job csak az alapértelmezett branch ellenőrzött kódját futtatja; PR esetén a statikus/infrastruktúra-ellenőrzés automatikus, az élő regresszió a merge utáni pushon indul.

## Allure hibakeresés

Nyisd meg a failed/broken tesztet: az API-lépéslista tartalmazza a locátort, időtartamot és hibát. A mellékletek között **Detailed attempt log** (teljes lépések, események, elsődleges/másodlagos hibák és cleanup), **Failure URL**, **Screenshot at failure** és a framework redaktált szemantikus UI-bizonyítéka található. A **URL at failure** link a hibakori, cleanup előtti konkrét oldalt nyitja. A test design ugyanazon teszt leírásában olvasható.

A URL történeti bizonyíték: a takarítás után a tesztrekord már törölt lehet. A hibakori adatokat a mentett screenshot és szemantikus napló őrzi.

A screenshot az alap üzleti Lightning-munkamenetben automatikusan készül. Az egyszeri jelszó-bootstrap Secret bevitele után a framework védelme szándékosan tiltja a képeket; ezt nem kerüljük meg. Launcher/böngészőindítás előtti hiba esetén nincs lefényképezhető UI; az infrastruktúrahiba és log ettől még szerepel a riportban. Trace/video alapértelmezetten kikapcsolt.

## Ellenőrizhetőség

`npm run test:evidence-harness` két elkülönített, szintetikus UI-esetet szándékosan elront. A wrapper csak akkor sikeres, ha a teszt ténylegesen failed, és az Allure-ban részletes log, pontos URL és érvényes automatikus PNG van, OTP/checksum és beágyazott SID/contentDoor canary nélkül. Ez nem kerül a normál regresszióba vagy a Netlify-főriportba. A HTML-generálás futásazonosítót és eredményszámot ellenőriz, hogy részfutások vagy korábbi eredmények ne olvadjanak össze.

Források: [e2e custom reporters](https://github.com/tester-army/e2e), [Allure JS reporter SDK](https://github.com/allure-framework/allure-js/blob/main/packages/allure-js-commons/README.md), [Allure 3 konfiguráció](https://allurereport.org/docs/v3/configure/), [Allure report generálás](https://allurereport.org/docs/v3/generate-report/), [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/), [Actions cache](https://github.com/actions/cache).
