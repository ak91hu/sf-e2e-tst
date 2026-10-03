// One-time administrator configuration; never used for business test data.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import '../support/environment.ts';
let cli = process.env.SF_CLI_PACKAGE;
if (!cli) {
  const cache = process.env.npm_config_cache || join(process.env.LOCALAPPDATA || '', 'npm-cache');
  for (const entry of readdirSync(join(cache, '_npx'))) {
    const candidate = join(cache, '_npx', entry, 'node_modules/@salesforce/cli/package.json');
    if (existsSync(candidate) && JSON.parse(readFileSync(candidate, 'utf8')).version === '2.152.14') cli = candidate;
  }
}
if (!cli) throw new Error('Authorize Salesforce CLI 2.152.14 first; alternatively set SF_CLI_PACKAGE.');
const require = createRequire(cli);
const { AuthInfo, Connection } = require('@salesforce/core');
const JSZip = require('jszip');
const { XMLBuilder } = require('fast-xml-parser');
const connection = await Connection.create({ authInfo: await AuthInfo.create({ username: process.env.SF_USERNAME }) });
const identity = await connection.identity();
if (identity.username !== process.env.SF_USERNAME || connection.instanceUrl !== process.env.SF_BASE_URL) throw new Error('Wrong configuration administrator/org.');
const admin = (await connection.query(`SELECT Email FROM User WHERE Id = '${identity.user_id}'`)).records[0];
const directory = resolve('.e2e-auth/provisioning'); mkdirSync(directory, { recursive: true });
const statePath = resolve(directory, 'users.json');
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { org: connection.instanceUrl, users: {} };
if (state.org !== connection.instanceUrl) throw new Error('Configuration journal belongs to a different org.');
const xml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const tag = (key, value) => `<${key}>${xml(value)}</${key}>`;
const ns = 'http://soap.sforce.com/2006/04/metadata';
const roles = [
  { key: 'sales', name: 'Sales Manager', permission: 'E2E_Sales_Manager', role: 'E2E_Sales_Manager', alias: 'e2esales', objects: { Account: true, Contact: true, Opportunity: true, Contract: true, Quote: true, Product2: true, Pricebook2: true, Order: 'edit' } },
  { key: 'service', name: 'Service Manager', permission: 'E2E_Service_Manager', role: 'E2E_Service_Manager', alias: 'e2eserv', objects: { Account: true, Contact: true, Case: true, Contract: false, Opportunity: false } },
];
const licenses = (await connection.query("SELECT TotalLicenses, UsedLicenses FROM UserLicense WHERE Name = 'Salesforce'")).records[0];
const needed = roles.filter(role => !state.users[role.key]).length;
if (licenses.TotalLicenses - licenses.UsedLicenses < needed) throw new Error('Not enough free Salesforce licenses; no existing user is deactivated.');
const zip = new JSZip();
const layouts = await connection.metadata.list({ type: 'Layout' }, connection.version);
const opportunityLayout = await connection.metadata.read('Layout', 'Opportunity-Opportunity Layout');
opportunityLayout.fullName = 'Opportunity-E2E Opportunity Layout';
opportunityLayout.relatedLists ||= [];
if (!opportunityLayout.relatedLists.some(list => list.relatedList === 'RelatedQuoteList')) opportunityLayout.relatedLists.push({ relatedList: 'RelatedQuoteList' });
const layoutXml = new XMLBuilder({ ignoreAttributes: false }).build({ Layout: { '@_xmlns': ns, ...opportunityLayout } });
zip.file('layouts/Opportunity-E2E Opportunity Layout.layout', `<?xml version="1.0"?>${layoutXml}`);
for (const role of roles) {
  const assignments = [...Object.keys(role.objects), ...(role.key === 'sales' ? ['PricebookEntry', 'QuoteLineItem', 'OpportunityLineItem'] : [])].map(object => {
    const available = layouts.filter(layout => layout.fullName.startsWith(`${object}-`));
    const preferred = object === 'Opportunity' ? { fullName: opportunityLayout.fullName } : available.find(layout => /-(?:Account|Contact|Opportunity|Contract|Quote|Product|Price Book|Case|Order) Layout$/.test(layout.fullName)) || available[0];
    if (!preferred) throw new Error(`No layout available for ${object}.`);
    return `<layoutAssignments>${tag('layout', preferred.fullName)}</layoutAssignments>`;
  }).join('');
  zip.file(`profiles/E2E ${role.name}.profile`, `<?xml version="1.0"?><Profile xmlns="${ns}">${tag('custom', true)}${tag('description', 'Owned least privilege UI test profile; business rights come from persona permission sets.')}${assignments}${tag('userLicense', 'Salesforce')}</Profile>`);
  let body = tag('description', 'Owned by salesforce-auto-reg. Least privilege UI regression persona.') + tag('label', `E2E ${role.name}`);
  for (const [object, write] of Object.entries(role.objects)) {
    const schema = await connection.sobject(object).describe();
    for (const field of schema.fields.filter(field => field.permissionable && !field.deprecatedAndHidden && !field.compoundFieldName)) {
      body += `<fieldPermissions>${tag('editable', Boolean(write) && field.updateable)}${tag('field', `${object}.${field.name}`)}${tag('readable', true)}</fieldPermissions>`;
    }
  }
  for (const [object, write] of Object.entries(role.objects)) {
    body += `<objectPermissions>${tag('allowCreate', write === true)}${tag('allowDelete', write === true)}${tag('allowEdit', Boolean(write))}${tag('allowRead', true)}${tag('modifyAllRecords', false)}${tag('object', object)}${tag('viewAllRecords', false)}</objectPermissions>`;
  }
  for (const object of Object.keys(role.objects)) body += `<tabSettings>${tag('tab', `standard-${object}`)}${tag('visibility', 'Visible')}</tabSettings>`;
  for (const permission of ['LightningExperienceUser', ...(role.key === 'sales' ? ['ActivateContract', 'DeleteActivatedContract'] : [])]) body += `<userPermissions>${tag('enabled', true)}${tag('name', permission)}</userPermissions>`;
  zip.file(`permissionsets/${role.permission}.permissionset`, `<?xml version="1.0"?><PermissionSet xmlns="${ns}">${body}</PermissionSet>`);
}
zip.file('package.xml', `<?xml version="1.0"?><Package xmlns="${ns}"><types>${roles.map(role => tag('members', role.permission)).join('')}<name>PermissionSet</name></types><types>${roles.map(role => tag('members', `E2E ${role.name}`)).join('')}<name>Profile</name></types><types><members>${opportunityLayout.fullName}</members><name>Layout</name></types><version>${connection.version}</version></Package>`);
const buffer = await zip.generateAsync({ type: 'nodebuffer' }); writeFileSync(resolve(directory, 'manager-permissions.zip'), buffer);
connection.metadata.pollInterval = 1000; connection.metadata.pollTimeout = 180000;
const deployment = connection.metadata.deploy(buffer, { singlePackage: true, rollbackOnError: true }); deployment.on('error', () => undefined);
const result = await deployment.complete(true);
if (!result.success) { console.error(JSON.stringify(result.details?.componentFailures)); throw new Error('Manager permission deployment failed.'); }
console.log('OK | Sales and Service permission sets deployed without administrator permissions.');
for (const role of roles) {
  const personaProfile = (await connection.query(`SELECT Id FROM Profile WHERE Name = 'E2E ${role.name}'`)).records[0];
  const username = `e2e.${role.key}.manager.${identity.organization_id.toLowerCase()}@example.invalid`;
  const existing = (await connection.query(`SELECT Id, Username, ProfileId FROM User WHERE Username = '${username}'`)).records[0];
  if (existing && state.users[role.key]?.id !== existing.Id) throw new Error('Refusing to modify an unjournaled existing user.');
  let userRole = (await connection.query(`SELECT Id FROM UserRole WHERE DeveloperName = '${role.role}'`)).records[0];
  if (!userRole) {
    const created = await connection.sobject('UserRole').create({ Name: `E2E ${role.name}`, DeveloperName: role.role, OpportunityAccessForAccountOwner: 'Edit', CaseAccessForAccountOwner: 'Edit' });
    if (!created.success) throw new Error(JSON.stringify(created.errors)); userRole = { Id: created.id };
  }
  let id = existing?.Id;
  if (!id) {
    const created = await connection.sobject('User').create({ Username: username, Email: admin.Email, FirstName: 'E2E', LastName: role.name,
      Alias: role.alias, ProfileId: personaProfile.Id, UserRoleId: userRole.Id, TimeZoneSidKey: 'Europe/Budapest', LocaleSidKey: 'en_US', EmailEncodingKey: 'UTF-8', LanguageLocaleKey: 'en_US', IsActive: true });
    if (!created.success) throw new Error(JSON.stringify(created.errors)); id = created.id;
    state.users[role.key] = { id, username, name: `E2E ${role.name}`, profile: 'Minimum Access - Salesforce', permission: role.permission, roleId: userRole.Id };
    writeFileSync(statePath, JSON.stringify(state, null, 2));
  }
  if (existing && existing.ProfileId !== personaProfile.Id) {
    const updated = await connection.sobject('User').update({ Id: id, ProfileId: personaProfile.Id });
    if (!updated.success) throw new Error(JSON.stringify(updated.errors));
  }
  state.users[role.key].profile = `E2E ${role.name}`; writeFileSync(statePath, JSON.stringify(state, null, 2));
  for (const name of [role.permission, 'Opportunity_E2E_JWT']) {
    const permission = (await connection.query(`SELECT Id FROM PermissionSet WHERE Name = '${name}' AND IsOwnedByProfile = false`)).records[0];
    const assigned = await connection.query(`SELECT Id FROM PermissionSetAssignment WHERE AssigneeId = '${id}' AND PermissionSetId = '${permission.Id}'`);
    if (!assigned.totalSize) { const created = await connection.sobject('PermissionSetAssignment').create({ AssigneeId: id, PermissionSetId: permission.Id }); if (!created.success) throw new Error(JSON.stringify(created.errors)); }
  }
  if (!state.users[role.key].initialPasswordConfigured) {
    // Complete the initial user setup without sending activation/password email.
    // The tests authenticate with JWT and never read or use this random password.
    const credentialsPath = resolve('.e2e-auth/persona-setup.json');
    const credentials = existsSync(credentialsPath) ? JSON.parse(readFileSync(credentialsPath, 'utf8')) : {};
    const password = () => `Ta!9aA${randomBytes(24).toString('base64url')}`;
    credentials[role.key] = { current: password(), next: password(), answer: randomBytes(20).toString('base64url') };
    writeFileSync(credentialsPath, JSON.stringify(credentials), { mode: 0o600 });
    await connection.soap.setPassword(id, credentials[role.key].current);
    state.users[role.key].initialPasswordConfigured = true;
    writeFileSync(statePath, JSON.stringify(state, null, 2));
  }
  console.log(`OK | ${role.name}: ${username} (E2E ${role.name} profile with explicit page layouts).`);
}
let env = readFileSync('.env', 'utf8');
for (const role of roles) {
  const key = `SF_${role.key.toUpperCase()}_USERNAME`; const line = `${key}=${state.users[role.key].username}`;
  env = new RegExp(`^${key}=.*$`, 'm').test(env) ? env.replace(new RegExp(`^${key}=.*$`, 'm'), line) : `${env}\n${line}\n`;
}
writeFileSync('.env', env, { mode: 0o600 });
console.log('OK | Persona usernames saved; JWT login requires no password or welcome-email activation.');
