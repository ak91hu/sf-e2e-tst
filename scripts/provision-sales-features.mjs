import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { readEnvironment } from '../support/environment.ts';
const environment = readEnvironment({ ...process.env, E2E_USER_SALESFORCE_USERNAME: process.env.SF_USERNAME });

const cache = process.env.npm_config_cache || join(process.env.LOCALAPPDATA || '', 'npm-cache');
let cliPackage = process.env.SF_CLI_PACKAGE;
if (!cliPackage) for (const entry of readdirSync(join(cache, '_npx'))) {
  const path = join(cache, '_npx', entry, 'node_modules/@salesforce/cli/package.json');
  if (existsSync(path) && JSON.parse(readFileSync(path, 'utf8')).version === '2.152.14') cliPackage = path;
}
if (!cliPackage) throw new Error('Install Salesforce CLI 2.152.14 and authorize the configured org first.');
const require = createRequire(cliPackage);
const { AuthInfo, Connection } = require('@salesforce/core');
const JSZip = require('jszip');
const connection = await Connection.create({ authInfo: await AuthInfo.create({ username: environment.username }) });
const identity = await connection.identity();
if (connection.instanceUrl !== environment.baseUrl || identity.username !== environment.username) throw new Error('Different org/user authorization.');
const directory = resolve('.e2e-auth/provisioning');
mkdirSync(directory, { recursive: true });
const before = await connection.metadata.retrieve({ apiVersion: connection.version,
  unpackaged: { types: [{ members: ['Quote'], name: 'Settings' }] } }).complete();
if (!existsSync(join(directory, 'quote-settings-before.zip'))) writeFileSync(join(directory, 'quote-settings-before.zip'), Buffer.from(before.zipFile, 'base64'));
const zip = new JSZip();
zip.file('settings/Quote.settings', '<?xml version="1.0" encoding="UTF-8"?><QuoteSettings xmlns="http://soap.sforce.com/2006/04/metadata"><enableQuote>true</enableQuote></QuoteSettings>');
zip.file('package.xml', `<?xml version="1.0" encoding="UTF-8"?><Package xmlns="http://soap.sforce.com/2006/04/metadata"><types><members>Quote</members><name>Settings</name></types><version>${connection.version}</version></Package>`);
const buffer = await zip.generateAsync({ type: 'nodebuffer' });
writeFileSync(join(directory, 'enable-standard-quotes.zip'), buffer);
connection.metadata.pollInterval = 1000;
connection.metadata.pollTimeout = 180_000;
const deploy = connection.metadata.deploy(buffer, { singlePackage: true, rollbackOnError: true });
deploy.on('error', () => undefined);
const result = await deploy.complete(true);
if (!result.success) throw new Error('Standard Quotes deployment failed. Inspect the local metadata package.');
const quote = await connection.sobject('Quote').describe();
if (!quote.createable) throw new Error('Quote creation is unavailable for the configured user.');
console.log('OK | Standard Quotes enabled and Quote creation verified. Original settings backed up locally.');
