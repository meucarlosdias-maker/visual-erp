export const ALLOWED_MATERIAL_ICONS = [
  'Wrench', 'Settings', 'Tool', 'Package', 'Box',
  'Container', 'Truck', 'HardHat', 'Shield', 'Star',
  'Zap', 'Sun', 'Moon', 'Globe', 'Building2',
] as const;

export function isValidHexColor(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}
