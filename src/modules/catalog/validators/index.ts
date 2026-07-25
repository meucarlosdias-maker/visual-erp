export const ALLOWED_CATEGORY_ICONS = [
  'Wrench', 'Settings', 'Tool', 'Pen', 'Paintbrush',
  'Monitor', 'Smartphone', 'Camera', 'Car', 'Truck',
  'Home', 'Building2', 'HardHat', 'Shield', 'Star',
  'Heart', 'Zap', 'Sun', 'Moon', 'Globe',
] as const;

export function isValidHexColor(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

export const COMPONENT_TYPE_LABELS: Record<string, string> = {
  MATERIAL: 'Material',
  SERVICE: 'Serviço',
  LABOR: 'Mão de Obra',
  EQUIPMENT: 'Equipamento',
  OUTSOURCED: 'Terceirizado',
  TRANSPORT: 'Transporte',
  TAX: 'Imposto',
  FINISHING: 'Acabamento',
  CUSTOM: 'Personalizado',
};

export function generateServiceCode(categoryId: string, index: number): string {
  const prefix = categoryId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  return `${prefix}-${String(index).padStart(4, '0')}`;
}
