export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
}

export function createSignature(secret: string, body: string, timestamp: number): string {
  const crypto = typeof window !== 'undefined'
    ? window.crypto
    : (require('node:crypto') as typeof import('node:crypto'));
  const data = `${timestamp}.${body}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  if (typeof crypto.subtle !== 'undefined') {
    return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then((key) => crypto.subtle.sign('HMAC', key, messageData))
      .then((sig) => Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('')) as unknown as string;
  }

  const nodeCrypto = require('node:crypto') as typeof import('node:crypto');
  return nodeCrypto.createHmac('sha256', secret).update(data).digest('hex');
}