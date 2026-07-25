import { z } from 'zod/v4';

const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const cepRegex = /^\d{5}-\d{3}$/;
const hexColor = /^#[0-9a-fA-F]{6}$/;

function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;

  const invalid = [
    '00000000000000', '11111111111111', '22222222222222',
    '33333333333333', '44444444444444', '55555555555555',
    '66666666666666', '77777777777777', '88888888888888',
    '99999999999999',
  ];
  if (invalid.includes(digits)) return false;

  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i], 10) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (parseInt(digits[12], 10) !== digit) return false;

  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i], 10) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return parseInt(digits[13], 10) === digit;
}

export const companySchema = z.object({
  id: z.string(),
  isActive: z.boolean(),

  razaoSocial: z.string().min(2, 'Razão social deve ter no mínimo 2 caracteres'),
  nomeFantasia: z.string().min(2, 'Nome fantasia deve ter no mínimo 2 caracteres'),
  cnpj: z.string()
    .regex(cnpjRegex, 'CNPJ deve estar no formato 00.000.000/0000-00')
    .refine((v) => isValidCnpj(v), 'CNPJ inválido'),
  inscricaoEstadual: z.string().optional().default(''),
  inscricaoMunicipal: z.string().optional().default(''),

  telefone: z.string().regex(phoneRegex, 'Telefone inválido').or(z.literal('')),
  celular: z.string().regex(phoneRegex, 'Celular inválido').or(z.literal('')),
  email: z.string().email('E-mail inválido').or(z.literal('')),
  site: z.string()
    .refine((v) => !v || isValidUrl(v), 'URL inválida. Use https://...')
    .or(z.literal('')),
  whatsapp: z.string().regex(phoneRegex, 'WhatsApp inválido').or(z.literal('')),

  cep: z.string().regex(cepRegex, 'CEP inválido').or(z.literal('')),
  logradouro: z.string().optional().default(''),
  numero: z.string().optional().default(''),
  complemento: z.string().optional().default(''),
  bairro: z.string().optional().default(''),
  cidade: z.string().optional().default(''),
  estado: z.string().optional().default(''),
  pais: z.string().optional().default('Brasil'),

  logoUrl: z.string().optional().default(''),
  faviconUrl: z.string().optional().default(''),
  corPrimaria: z.string().regex(hexColor, 'Cor inválida').default('#3b82f6'),
  corSecundaria: z.string().regex(hexColor, 'Cor inválida').default('#1e40af'),

  banco: z.string().optional().default(''),
  agencia: z.string().optional().default(''),
  conta: z.string().optional().default(''),
  pix: z.string().optional().default(''),
  favorecido: z.string().optional().default(''),

  horarioInicio: z.string().default('08:00'),
  horarioFim: z.string().default('18:00'),
  trabalhaSabado: z.boolean().default(true),
  trabalhaDomingo: z.boolean().default(false),

  moeda: z.string().default('BRL'),
  idioma: z.string().default('pt-BR'),
  timezone: z.string().default('America/Sao_Paulo'),
  formatoData: z.string().default('DD/MM/YYYY'),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type CompanySchemaType = z.infer<typeof companySchema>;

export const companyFormSchema = companySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true,
  deletedBy: true,
});

export type CompanyFormType = z.infer<typeof companyFormSchema>;
