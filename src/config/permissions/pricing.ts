export const PRICING_PERMISSIONS = [
  'pricing.view',
  'pricing.execute',
  'pricing.simulate',
] as const;

export type PricingPermission = typeof PRICING_PERMISSIONS[number];
