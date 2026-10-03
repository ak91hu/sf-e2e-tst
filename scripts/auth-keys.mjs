import { spawnSync } from 'node:child_process';
import { createPrivateKey, createPublicKey, X509Certificate } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = resolve('.e2e-auth');
const key = resolve(directory, 'jwt.key');
const certificate = resolve(directory, 'jwt.crt');
if (existsSync(key) || existsSync(certificate)) {
  console.error('Key/certificate already exists; refusing to overwrite. Rotate deliberately in Salesforce first.');
  process.exit(2);
}
mkdirSync(directory, { recursive: true, mode: 0o700 });
const gitOpenSsl = 'C:/Program Files/Git/usr/bin/openssl.exe';
const executable = process.env.OPENSSL_PATH || (existsSync(gitOpenSsl) ? gitOpenSsl : 'openssl');
const result = spawnSync(executable, ['req', '-new', '-x509', '-newkey', 'rsa:2048', '-nodes',
  '-keyout', key, '-out', certificate, '-days', '365', '-sha256', '-subj', '/CN=Salesforce-Opportunity-E2E'], { stdio: 'pipe' });
if (result.error || result.status !== 0) {
  console.error('Certificate generation failed. Install OpenSSL or set OPENSSL_PATH. No key material is printed.');
  process.exit(2);
}
chmodSync(key, 0o600);
const cert = new X509Certificate(readFileSync(certificate));
const pub = createPublicKey(createPrivateKey(readFileSync(key)));
if (!cert.publicKey.equals(pub)) throw new Error('Generated certificate/key mismatch.');
console.log(`Upload this public certificate to Salesforce: ${certificate}`);
console.log(`Private key remains local (never upload/commit): ${key}`);
console.log(`Certificate valid until: ${cert.validTo}`);
