import type { SdkConfig } from './types';
import { createSignature } from './helpers';

export function createAuthHeaders(config: SdkConfig, body: string): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createSignature(config.secret, body, timestamp);

  return {
    'X-API-Key': config.apiKey,
    'X-Timestamp': String(timestamp),
    'X-Signature': signature,
    'Content-Type': 'application/json',
  };
}