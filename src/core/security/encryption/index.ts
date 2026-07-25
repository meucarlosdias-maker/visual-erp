const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

let cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(process.env.ENCRYPTION_KEY || 'visual-erp-default-encryption-key-32'),
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt'],
  );
  const raw = await crypto.subtle.exportKey('raw', keyMaterial);
  const hash = await crypto.subtle.digest('SHA-256', raw);
  cachedKey = await crypto.subtle.importKey('raw', hash, { name: ALGORITHM }, false, ['encrypt', 'decrypt']);
  return cachedKey;
}

export async function encryptSensitive(data: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(data);
  const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return `enc:${Buffer.from(combined).toString('base64')}`;
}

export async function decryptSensitive(encrypted: string): Promise<string> {
  if (!encrypted.startsWith('enc:')) return encrypted;
  const key = await getKey();
  const combined = Buffer.from(encrypted.slice(4), 'base64');
  const iv = new Uint8Array(combined.buffer, 0, IV_LENGTH);
  const data = new Uint8Array(combined.buffer, IV_LENGTH);
  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data);
  return new TextDecoder().decode(decrypted);
}

export function maskSensitive(value: string, visibleChars = 4): string {
  if (value.length <= visibleChars) return value;
  const visible = value.slice(-visibleChars);
  const masked = '*'.repeat(value.length - visibleChars);
  return masked + visible;
}

function secureRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

export function generateToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = secureRandomBytes(length);
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(bytes[i] % chars.length);
  }
  return token;
}

export function obfuscateEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  return `${local[0]}***@${domain}`;
}
