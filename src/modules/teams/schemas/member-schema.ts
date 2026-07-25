import { z } from 'zod/v4';

export const teamRoleSchema = z.enum([
  'LEADER', 'INSTALLER', 'ASSISTANT', 'WELDER', 'PAINTER',
  'DESIGNER', 'PRINTER_OPERATOR', 'FINISHING', 'CUSTOM',
]);

export type TeamRole = z.infer<typeof teamRoleSchema>;

export const TEAM_ROLE_LABELS: Record<string, string> = {
  LEADER: 'Líder',
  INSTALLER: 'Instalador',
  ASSISTANT: 'Ajudante',
  WELDER: 'Soldador',
  PAINTER: 'Pintor',
  DESIGNER: 'Designer',
  PRINTER_OPERATOR: 'Operador de Impressão',
  FINISHING: 'Acabamento',
  CUSTOM: 'Personalizado',
};

export const teamMemberSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  teamId: z.string().optional().default(''),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  role: teamRoleSchema.optional().default('LEADER'),
  hourCost: z.coerce.number().min(0).default(0),
  active: z.boolean().default(true),
});

export type TeamMemberSchemaType = z.infer<typeof teamMemberSchema>;

export const teamMemberFormSchema = teamMemberSchema.omit({
  id: true, companyId: true,
});

export type TeamMemberFormType = z.infer<typeof teamMemberFormSchema>;
