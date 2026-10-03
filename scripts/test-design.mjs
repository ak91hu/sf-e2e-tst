import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { testDesigns } from '../docs/test-design.ts';
import { spawnSync } from 'node:child_process';

assert.equal(testDesigns.length, 41, '36 regression cases + 3 optional AI cases + 2 session setups.');
assert.equal(new Set(testDesigns.map(item => item.id)).size, testDesigns.length);
for (const item of testDesigns) {
  assert.ok(existsSync(item.file), `Missing source: ${item.file}`);
  assert.ok(item.steps.length >= 3 && item.steps.every(step => step.length === 2 && step.every(value => value.trim())));
}
const cell = value => value.replaceAll('|', '\\|').replaceAll('\n', '<br>');
const text = '# Salesforce UI – tesztlépés szintű test design\n\n' +
  '41 design: 36 alapértelmezett regressziós UI-eset, 3 opcionális AI UI-eset és 2 hitelesítési setup. A design tesztterv; a tényleges végrehajtás eredménye a VERIFICATION.md-ben és az Allure-ban található. A közös előkészítés lépéseit minden eset táblázata kibontva tartalmazza.\n\n' +
  'A Salesforce üzleti adatok előkészítése, ellenőrzése és takarítása kizárólag UI-n történik. A hitelesítési endpointok és az egyszeri adminisztratív provisioning külön konfigurációs feladatok. Minden eset izolált saját adatot használ, az admin nem hoz létre Opportunityt. A lépések sikerét látható mező, vezérlő, rekord-URL vagy listaeredmény bizonyítja. Nincs fix várakozás, API-orákulum vagy automatikus tesztújrapróbálkozás.\n\n' +
  'A konkrét napi dátumok futáskor képződnek; a `futureDate` UTC-alapú, a Salesforce Closed Won automatikus dátuma a felhasználó időzónáját követi (`SF_TIME_ZONE`, alapértelmezés Europe/Budapest). Stage-értékek és Won/Lost százalékok környezeti változókkal illeszthetők más org-hoz; az alábbi design a konfigurált Developer Edition alapértékeit írja le. Az AI-esetekhez külön modell-hozzáférés és kvóta kell.\n\n' +
  'Szerkeszthető forrás: [docs/test-design.ts](docs/test-design.ts). Frissítés: `npm run design:generate`; eltérésellenőrzés: `npm run design:check`. Az Allure minden megfeleltetett eset leírásában ugyanezeket az elvárt lépéseket mutatja.\n\n' +
  '| Azonosító | Cél | Szerepkör |\n| --- | --- | --- |\n' + testDesigns.map(item => `| [${item.id}](#${item.id.toLowerCase()}) | ${cell(item.title)} | ${cell(item.persona)} |`).join('\n') + '\n\n' +
  testDesigns.map(item => `## ${item.id}\n\n**Cél:** ${item.title}\n\n**Forrás:** [${item.file}](${item.file})\n\n**Szerepkör:** ${item.persona}\n\n**Előfeltételek:** ${item.preconditions}\n\n**Tesztadat:** ${item.data}\n\n| # | UI-művelet / ellenőrzés | Elvárt eredmény |\n| --- | --- | --- |\n${item.steps.map(([action, expected], index) => `| ${index + 1} | ${cell(action)} | ${cell(expected)} |`).join('\n')}\n`).join('\n');
if (process.argv.includes('--check')) {
  assert.equal(readFileSync('TEST_DESIGN.md', 'utf8'), text, 'Regenerate TEST_DESIGN.md.');
  const found = new Set();
  for (const config of ['e2e.config.ts', 'e2e.agent.config.ts']) {
    const child = spawnSync(process.execPath, ['scripts/e2e.mjs', 'list', '--config', config, '--reporter', 'json'], { encoding: 'utf8' });
    assert.equal(child.status, 0, 'Test collection must succeed for design coverage.');
    for (const pair of JSON.parse(child.stdout).pairs) {
      const id = pair.title.split(' |')[0];
      const design = testDesigns.find(item => item.id === id);
      assert.ok(design && design.file === pair.file, `Missing or mismatched design: ${id}`);
      found.add(id);
    }
  }
  assert.equal(found.size, testDesigns.length, 'Every design must map to an executable case/setup.');
}
else writeFileSync('TEST_DESIGN.md', text);
console.log(`OK | ${testDesigns.length} test designs, ${testDesigns.reduce((sum, item) => sum + item.steps.length, 0)} explicit steps.`);
