'use server';

import { companyService } from '../services/company-service';
import { successResponse, errorResponse } from '@/lib/action-response';
import type { Company } from '../types';
import type { ActionResponse } from '@/lib/action-response';

export async function getCompanyAction(): Promise<ActionResponse<Company>> {
  try {
    const company = await companyService.fetchCompany();
    if (!company) return errorResponse('Empresa não encontrada');
    return successResponse(company);
  } catch {
    return errorResponse('Erro ao carregar dados da empresa');
  }
}

export async function saveCompanyAction(data: Company): Promise<ActionResponse<Company>> {
  try {
    const result = await companyService.saveCompany(data);
    return successResponse(result, 'Empresa salva com sucesso');
  } catch (err) {
    if (err instanceof Error) return errorResponse(err.message);
    return errorResponse('Erro ao salvar empresa');
  }
}
