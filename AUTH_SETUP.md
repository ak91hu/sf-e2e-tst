# Salesforce hitelesítés és egyszeri konfiguráció

Ezen az orgon az alkalmazás, a tanúsítvány és mindkét üzleti felhasználó beállítása elkészült. A regresszió JWT + Single Access UI Bridge használatával nyit friss sessiont, jelszó és ismétlődő e-mailkód nélkül. Váratlan interaktív hitelesítésnél gyors hibával megáll.

## Jelenlegi beállítás

- External Client App: `Opportunity_E2E_Regression`, local distribution.
- RSA-2048 tanúsítvány: `.e2e-auth/jwt.crt`, lejárat **2027-10-02**; privát kulcs `.e2e-auth/jwt.key`.
- Scope-ok: **Web, RefreshToken**; nincs API scope. Refresh tokent nem tárolunk.
- Policy: **Admin approved users are pre-authorized**; permission set `Opportunity_E2E_JWT`.
- Előengedélyezettek: konfigurációs admin, E2E Sales Manager, E2E Service Manager. A regresszió az utóbbi kettőt használja.
- IP Enforce, 120 perces session. Org-wide MFA-/IP-védelmet nem lazítottunk.
- Consumer Key a `.env`-ben; Consumer Secret nem szükséges.

## Új org / konfiguráció

Az egyszeri konfiguráció Salesforce CLI 2.152.14 és admin OAuth használatával történik; a regresszió ezek nélkül fut.

```powershell
npm run auth:keys
npm exec --yes --package=@salesforce/cli@2.152.14 -- sf org login web --instance-url <org-URL>
npm run auth:provision
npm run features:provision
npm run users:provision
npm run users:setup
npm run doctor
npm run test:auth
npm run test:roles
```

Az `SF_USERNAME` az egyszeri konfigurációs admin neve; nem az üzleti regresszió alapértelmezett felhasználója. A provisioning hivatalos Salesforce SDK-val konfigurál saját alkalmazást, QuoteSettings funkciót, minimális profilokat/layoutot, permission seteket, szerepköröket és felhasználókat. Ez konfiguráció, nem üzleti tesztadat-generálás.

Az `auth:provision` tulajdonosi napló alapján kezeli az alkalmazást. A `features:provision` megtartja az eredeti QuoteSettings backupját. A `users:provision` két szabad Salesforce-licencet igényel; nem deaktivál más felhasználót. Saját Opportunity layouton jelenik meg a Quotes lista; a standard layoutot nem írjuk át. A helyi provisioning naplók/ZIP-ek a Gitből kizárt `.e2e-auth/provisioning` mappában vannak.

A kezdeti felhasználóaktiválást, jelszót és biztonsági kérdést a `users:setup` UI-teszt állítja be Secret mezőkkel. A bootstrap adatok helyben, a `.e2e-auth/persona-setup.json` fájlban maradnak. Ez egyszeri lépés; újrafuttatáskor a provisioning nem állítja vissza a jelszót, az aktív felhasználónál a UI-teszt Lightning-hozzáférést ellenőriz.

## Futási konfiguráció

```dotenv
SF_BASE_URL=https://<org>.develop.my.salesforce.com
SF_SALES_USERNAME=<Sales Manager username>
SF_SERVICE_USERNAME=<Service Manager username>
SF_CLIENT_ID=<Consumer Key>
SF_JWT_PRIVATE_KEY_FILE=.e2e-auth/jwt.key
SF_JWT_AUDIENCE=https://login.salesforce.com
```

Developer Edition audience: `login.salesforce.com`; valódi sandbox: `test.salesforce.com`. A projekt jelenlegi URL-validációja Developer Edition My Domainre korlátozott; más típusú org támogatásához ezt is tudatosan illeszteni kell. A hitelesítési kérések kizárólag a konfigurált My Domain originre mennek.

A `support/auth-engine.ts` a keretrendszer nyilvános `defineEngine` / `EngineAttemptContext.resolveSecret` szerződését használja. Az egyszer használatos OTP/checksum engine-ben marad; a navigáció az engine saját `session.open` műveletével történik. A naplózott külső lépés csak a szerepkört nevezi meg. A credential URL nem kerül a `browser.goto` szöveges lépéscímkéjébe: az e2e 0.15.1 a későn regisztrált titkot ebben a címkében nem írná visszamenőleg át. A framework titokregisztrációja és képbiztonsági szabályai változatlanok.

Az üzleti UI-sessionbe nem írunk jelszót vagy tokent; így a framework automatikus hibaképernyőképe készülhet a Lightning üzleti oldalról. A kezdeti jelszó/biztonsági kérdés bootstrap továbbra is `Secret` mezőket használ, és ezek után a framework szándékosan elnyomja a screenshotokat. A fallback hitelesítési űrlap is ezt a konzervatív szabályt tartja meg. Trace és videó minden alapkonfigurációban kikapcsolt.

Sales és Service külön session setupot kapnak. Felhasználóváltáskor a böngésző saját állapotát töröljük, új JWT-sessiont nyitunk, és a profilmenüben ellenőrizzük a nevet. A normál regresszió nem vár e-mailkódra; a JWT előengedélyezése a hitelesítés támogatott, egyszeri konfigurációját adja, az org globális védelmét nem módosítja.

## CI és karbantartás

CI secrets: `SF_SALES_USERNAME`, `SF_SERVICE_USERNAME`, `SF_CLIENT_ID`, `SF_JWT_PRIVATE_KEY` (teljes PEM valódi sortörésekkel). Admin, jelszó, e-mailkód és AI-kulcs nem szükséges. A privát kulcsot és authállományokat ne töltsd fel repositoryba vagy jelentésartifactba. Lejárat előtt új tanúsítvány, appfrissítés és CI-kulcscsere szükséges; az `auth:keys` meglévő kulcsot nem ír felül.

Az üzleti setup admin azonosítóval leáll. Az elkülönített `e2e.recovery.config.ts` setup kizárólag pontos, saját rekordnaplók UI-helyreállítására szolgál; normál esetben Sales, Case esetén Service sessionnel. Korábbi adminos felderítési rekordokhoz külön folyamatkörnyezeti override használható. Ez nem írja át az üzleti felhasználót, és az Opportunity-létrehozási helper itt is tiltja az admint.

Ellenőrzések: `npm run test:unit`, `npm run test:auth-harness`, `npm run test:evidence-harness`, `npm run test:auth`. A szintetikus harness minden kérést elfog: a Secret fallback, a natív engine-belépés, a titokmentes szöveges jelentés és a screenshot lehetősége ellenőrzött. A külön evidence harness szándékos UI-assertion hibát vár, és ellenőrzi az Allure részletes logot, a pontos URL-t és az automatikus PNG-t. Ez nem Salesforce regressziós eset, és nem kerül a publikált üzleti futásba. Az élő auth teszt bizonyítja a valódi sessiont.

Források: [JWT bearer](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_jwt_flow_ca.htm&language=en_US&type=5), [előengedélyezés](https://developer.salesforce.com/docs/analytics/sdk/guide/sdk-setup-auth-extended.html), [Single Access UI Bridge](https://help.salesforce.com/s/articleView?id=sf.frontdoor_singleaccess.htm&language=en_US&type=5).
