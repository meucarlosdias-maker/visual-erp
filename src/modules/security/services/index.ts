import { NotFoundError } from '@/lib/errors';
import { SecurityRepository } from '../repository';
import type { AuditEvent, AccessLog, SecurityPolicy, DataRetentionPolicy } from '../types';
import type { AuditInput, PolicyInput, PolicyUpdate, RetentionInput, RetentionUpdate } from '../schemas';
import { checkCompliance, listFrameworks, getAllComplianceChecks } from '@/core/security';
import type { ComplianceFramework } from '@/core/security';

const repository = new SecurityRepository();

export class SecurityModuleService {
  async listAuditEvents(): Promise<AuditEvent[]> { return repository.findAllAuditEvents(); }
  async getAuditEvent(id: string): Promise<AuditEvent> {
    const evt = await repository.findAuditById(id);
    if (!evt) throw new NotFoundError('AuditEvent', id);
    return evt;
  }
  async createAudit(input: AuditInput): Promise<AuditEvent> { return repository.createAudit(input); }

  async listAccessLogs(): Promise<AccessLog[]> { return repository.findAllAccessLogs(); }
  async createAccessLog(input: { userId?: string | null; action: string; resource: string; status: string; ip?: string | null; userAgent?: string | null }): Promise<AccessLog> { return repository.createAccessLog(input); }

  async listPolicies(): Promise<SecurityPolicy[]> { return repository.findAllPolicies(); }
  async getPolicy(id: string): Promise<SecurityPolicy> {
    const pol = await repository.findPolicyById(id);
    if (!pol) throw new NotFoundError('SecurityPolicy', id);
    return pol;
  }
  async createPolicy(input: PolicyInput): Promise<SecurityPolicy> { return repository.createPolicy(input); }
  async updatePolicy(id: string, input: PolicyUpdate): Promise<SecurityPolicy> {
    await this.getPolicy(id);
    return repository.updatePolicy(id, input);
  }
  async deletePolicy(id: string): Promise<boolean> {
    await this.getPolicy(id);
    return repository.deletePolicy(id);
  }

  async listRetentionPolicies(): Promise<DataRetentionPolicy[]> { return repository.findAllRetentionPolicies(); }
  async getRetentionPolicy(id: string): Promise<DataRetentionPolicy> {
    const ret = await repository.findRetentionById(id);
    if (!ret) throw new NotFoundError('DataRetentionPolicy', id);
    return ret;
  }
  async createRetentionPolicy(input: RetentionInput): Promise<DataRetentionPolicy> { return repository.createRetentionPolicy(input); }
  async updateRetentionPolicy(id: string, input: RetentionUpdate): Promise<DataRetentionPolicy> {
    await this.getRetentionPolicy(id);
    return repository.updateRetentionPolicy(id, input);
  }
  async deleteRetentionPolicy(id: string): Promise<boolean> {
    await this.getRetentionPolicy(id);
    return repository.deleteRetentionPolicy(id);
  }

  getCompliance(framework: ComplianceFramework) { return checkCompliance(framework); }
  listFrameworks() { return listFrameworks(); }
  getAllCompliance() { return getAllComplianceChecks(); }
}

export const securityModuleService = new SecurityModuleService();
