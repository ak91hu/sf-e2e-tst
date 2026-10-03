import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { randomBytes, X509Certificate, createPrivateKey, createPublicKey } from 'node:crypto';
import { readEnvironment } from '../support/environment.ts';
import { requestUiBridge } from '../support/oauth.ts';

const appName = 'Opportunity_E2E_Regression';
const environment = readEnvironment({ ...process.env, E2E_USER_SALESFORCE_USERNAME: process.env.SF_USERNAME });
const permissionName = 'Opportunity_E2E_JWT';
const directory = resolve('.e2e-auth/provisioning');
const stateFile = join(directory, 'state.json');
mkdirSync(directory, { recursive: true, mode: 0o700 });
const cache = process.env.npm_config_cache || join(process.env.LOCALAPPDATA || '', 'npm-cache');
let cliPackage = process.env.SF_CLI_PACKAGE;
if (!cliPackage) {
  for (const entry of readdirSync(join(cache, '_npx'))) {
    const candidate = join(cache, '_npx', entry, 'node_modules/@salesforce/cli/package.json');
    if (existsSync(candidate) && JSON.parse(readFileSync(candidate, 'utf8')).version === '2.152.14') cliPackage = candidate;
  }
}
if (!cliPackage) throw new Error('Install the Salesforce CLI first: npm exec --yes --package=@salesforce/cli@2.152.14 -- sf version');
const require = createRequire(cliPackage);
const { AuthInfo, Connection } = require('@salesforce/core');
const JSZip = require('jszip');
const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser({ removeNSPrefix: true, parseTagValue: false });
const xml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const element = (name, value) => `<${name}>${xml(value)}</${name}>`;
const ns = 'http://soap.sforce.com/2006/04/metadata';
const secretValues = [];
const safe = text => secretValues.reduce((s, secret) => s.replaceAll(secret, '<redacted>'), String(text));

try {
  const privateKey = readFileSync(process.env.SF_JWT_PRIVATE_KEY_FILE || '.e2e-auth/jwt.key', 'utf8');
  secretValues.push(privateKey);
  const certPem = readFileSync('.e2e-auth/jwt.crt', 'utf8');
  const cert = new X509Certificate(certPem);
  if (!cert.publicKey.equals(createPublicKey(createPrivateKey(privateKey))) || Date.parse(cert.validTo) <= Date.now()) {
    throw new Error('JWT certificate/key mismatch or expired certificate.');
  }
  const authInfo = await AuthInfo.create({ username: environment.username });
  const connection = await Connection.create({ authInfo });
  const identity = await connection.identity();
  secretValues.push(connection.accessToken);
  if (identity.username !== environment.username || connection.instanceUrl !== environment.baseUrl) {
    throw new Error('Admin authorization belongs to a different org/user.');
  }
  const users = await connection.query(`SELECT Id, Email, Profile.Name FROM User WHERE Id = '${identity.user_id}'`);
  const user = users.records[0];
  if (!user?.Email) throw new Error('Cannot read the authorized user contact email.');
  const appList = await connection.metadata.list({ type: 'ExternalClientApplication' }, connection.version);
  const existing = appList.some(app => app.fullName === appName);
  const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf8')) : {
    org: environment.baseUrl, username: environment.username, certificate: cert.fingerprint256,
    clientId: randomBytes(32).toString('hex'), createdByThisProject: false,
  };
  secretValues.push(state.clientId);
  if (state.org !== environment.baseUrl || state.username !== environment.username || state.certificate !== cert.fingerprint256
      || (existing && !state.createdByThisProject)) throw new Error('Existing application is not identified as owned by this project.');
  writeFileSync(stateFile, JSON.stringify(state), { mode: 0o600 });

  async function deploy(label, files) {
    const zip = new JSZip();
    const types = new Map();
    for (const file of files) {
      zip.file(`${file.directory}/${file.name}.${file.suffix}`, `<?xml version="1.0" encoding="UTF-8"?><${file.type} xmlns="${ns}">${file.body}</${file.type}>`);
      types.set(file.type, [...(types.get(file.type) || []), file.name]);
    }
    zip.file('package.xml', `<?xml version="1.0" encoding="UTF-8"?><Package xmlns="${ns}">${[...types].map(([type, names]) => `<types>${names.map(n => element('members', n)).join('')}${element('name', type)}</types>`).join('')}<version>${connection.version}</version></Package>`);
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    writeFileSync(join(directory, `${label}.zip`), buffer, { mode: 0o600 });
    console.log(`Deploying ${label}...`);
    connection.metadata.pollInterval = 1000;
    connection.metadata.pollTimeout = 180_000;
    const deployment = connection.metadata.deploy(buffer, { singlePackage: true, rollbackOnError: true });
    deployment.on('error', () => undefined);
    const result = await deployment.complete(true);
    if (!result.success) {
      const failures = result.details?.componentFailures;
      const list = Array.isArray(failures) ? failures : failures ? [failures] : [];
      for (const failure of list) console.error(safe(`${failure.fullName}: ${failure.problem}`));
      throw new Error(`${label} deployment failed (no successful partial deployment).`);
    }
    console.log(`OK | ${label} deployed.`);
  }
  const permissionQuery = () => connection.query(`SELECT Id, Name FROM PermissionSet WHERE Name = '${permissionName}' AND IsOwnedByProfile = false`);
  let permissions = await permissionQuery();
  if (!permissions.totalSize) {
    await deploy('permission-set', [{ type: 'PermissionSet', directory: 'permissionsets', suffix: 'permissionset', name: permissionName,
      body: element('description', 'Pre-authorization gate for this project JWT app; business access comes from the existing user profile.') + element('label', 'Opportunity E2E JWT') }]);
    permissions = await permissionQuery();
  }
  const permission = permissions.records[0];
  if (!permission?.Id) throw new Error('Pre-authorization permission set was not created.');
  await deploy('jwt-application', [
    { type: 'ExternalClientApplication', directory: 'externalClientApps', suffix: 'eca', name: appName,
      body: element('contactEmail', user.Email) + element('description', 'Salesforce Opportunity regression JWT authentication, owned by salesforce-auto-reg.')
        + element('distributionState', 'Local') + element('isProtected', false) + element('label', 'Opportunity E2E Regression')
        + (existing ? element('orgScopedExternalApp', `${identity.organization_id}:${appName}`) : '') },
    { type: 'ExtlClntAppGlobalOauthSettings', directory: 'extlClntAppGlobalOauthSets', suffix: 'ecaGlblOauth', name: `${appName}_Global`,
      body: element('callbackUrl', 'https://login.salesforce.com/services/oauth2/success') + element('certificate', certPem)
        + element('consumerKey', state.clientId) + element('externalClientApplication', appName) + element('isConsumerSecretOptional', false)
        + element('isPkceRequired', true) + element('isSecretRequiredForRefreshToken', true) + element('label', 'Opportunity E2E JWT Global')
        + element('shouldRotateConsumerKey', false) + element('shouldRotateConsumerSecret', false) },
    { type: 'ExtlClntAppOauthSettings', directory: 'extlClntAppOauthSettings', suffix: 'ecaOauth', name: `${appName}_OAuth`,
      body: element('commaSeparatedOauthScopes', 'Web,RefreshToken') + element('externalClientApplication', appName) + element('label', 'Sales E2E UI Login') },
    { type: 'ExtlClntAppOauthConfigurablePolicies', directory: 'extlClntAppOauthPolicies', suffix: 'ecaOauthPlcy', name: `${appName}_OAuthPolicy`,
      body: element('commaSeparatedPermissionSet', permission.Name) + element('externalClientApplication', appName)
        + element('ipRelaxationPolicyType', 'Enforce') + element('label', 'Opportunity E2E JWT Preauthorized User')
        + element('permittedUsersPolicyType', 'AdminApprovedPreAuthorized') + element('sessionTimeoutInMinutes', 120) },
    { type: 'ExtlClntAppConfigurablePolicies', directory: 'extlClntAppPolicies', suffix: 'ecaPlcy', name: `${appName}_Policy`,
      body: element('externalClientApplication', appName) + element('isEnabled', true) + element('isOauthPluginEnabled', true)
        + element('label', 'Opportunity E2E Application Policy') + element('startPage', 'None') },
  ]);
  state.createdByThisProject = true;
  writeFileSync(stateFile, JSON.stringify(state), { mode: 0o600 });
  const assignments = await connection.query(`SELECT Id FROM PermissionSetAssignment WHERE AssigneeId = '${user.Id}' AND PermissionSetId = '${permission.Id}'`);
  if (!assignments.totalSize) {
    const assigned = await connection.sobject('PermissionSetAssignment').create({ AssigneeId: user.Id, PermissionSetId: permission.Id });
    if (!assigned.success) throw new Error('Permission set assignment failed.');
  }
  console.log('OK | Configuration administrator JWT pre-authorization assigned. Business personas are configured by users:provision.');
  await requestUiBridge({ baseUrl: environment.baseUrl, username: environment.username, clientId: state.clientId, privateKey,
    audience: process.env.SF_JWT_AUDIENCE || 'https://login.salesforce.com' });
  const envFile = resolve('.env');
  let env = readFileSync(envFile, 'utf8');
  env = /^SF_CLIENT_ID=.*$/m.test(env) ? env.replace(/^SF_CLIENT_ID=.*$/m, `SF_CLIENT_ID=${state.clientId}`) : `${env}\nSF_CLIENT_ID=${state.clientId}\n`;
  writeFileSync(envFile, env, { mode: 0o600 });
  console.log('OK | Live JWT grant and UI Bridge accepted. SF_CLIENT_ID saved locally without printing its value.');
} catch (error) {
  console.error(safe(error.message));
  process.exitCode = 1;
}
