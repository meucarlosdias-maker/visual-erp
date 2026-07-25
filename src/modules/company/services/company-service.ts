import type { Company, CompanyFormType } from '../types';
import { companyRepository } from '../repository/company-repository';
import { companySchema, companyFormSchema } from '../schemas/company-schema';

class CompanyService {
  async fetchCompany(): Promise<Company | null> {
    return companyRepository.get();
  }

  async createCompany(data: CompanyFormType): Promise<Company> {
    const parsed = companyFormSchema.parse(data);
    return companyRepository.create(parsed as Company);
  }

  async saveCompany(data: Company): Promise<Company> {
    const parsed = companySchema.parse(data);
    return companyRepository.update(parsed);
  }

  async validateCompany(data: unknown): Promise<{ valid: boolean; errors?: Record<string, string[]> }> {
    const result = companySchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }
      return { valid: false, errors };
    }
    return { valid: true };
  }
}

export const companyService = new CompanyService();
