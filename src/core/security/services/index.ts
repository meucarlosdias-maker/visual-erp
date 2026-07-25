import { recordAudit, queryAudit, getAuditById, listAuditEvents } from '../audit';
import { checkCompliance, listFrameworks, getAllComplianceChecks } from '../compliance';
import { requestApproval, approve, reject, listApprovals, getApproval } from '../governance';
import { createPolicy, updatePolicy, deletePolicy, getPolicy, listPolicies } from '../policies';
import { encryptSensitive, decryptSensitive, maskSensitive, generateToken, obfuscateEmail } from '../encryption';
import { createRetentionPolicy, updateRetentionPolicy, deleteRetentionPolicy, getRetentionPolicy, listRetentionPolicies, getPolicyForEntity } from '../retention';
import type { AuditEntry, AuditAction, ComplianceCheck, ComplianceFramework, GovernanceApproval, SecurityPolicyDefinition, PolicyRule, RetentionPolicyDefinition } from '../types';

export class SecurityService {
  audit(input: Omit<AuditEntry, 'id' | 'createdAt'>): AuditEntry { return recordAudit(input); }
  queryAudit(filters?: Parameters<typeof queryAudit>[0]): AuditEntry[] { return queryAudit(filters); }
  getAuditEntry(id: string): AuditEntry | undefined { return getAuditById(id); }
  listAudit(limit?: number): AuditEntry[] { return listAuditEvents(limit); }

  checkCompliance(framework: ComplianceFramework): ComplianceCheck { return checkCompliance(framework); }
  listFrameworks(): ComplianceFramework[] { return listFrameworks(); }
  getAllChecks(): ComplianceCheck[] { return getAllComplianceChecks(); }

  requestApproval(input: Parameters<typeof requestApproval>[0]): GovernanceApproval { return requestApproval(input); }
  approveApproval(id: string, userId: string): GovernanceApproval | undefined { return approve(id, userId); }
  rejectApproval(id: string, userId: string): GovernanceApproval | undefined { return reject(id, userId); }
  listApprovals(companyId?: string): GovernanceApproval[] { return listApprovals(companyId); }
  getApproval(id: string): GovernanceApproval | undefined { return getApproval(id); }

  createPolicy(input: Parameters<typeof createPolicy>[0]): SecurityPolicyDefinition { return createPolicy(input); }
  updatePolicy(id: string, updates: Parameters<typeof updatePolicy>[1]): SecurityPolicyDefinition | undefined { return updatePolicy(id, updates); }
  deletePolicy(id: string): boolean { return deletePolicy(id); }
  getPolicy(id: string): SecurityPolicyDefinition | undefined { return getPolicy(id); }
  listPolicies(companyId?: string): SecurityPolicyDefinition[] { return listPolicies(companyId); }

  async encrypt(data: string): Promise<string> { return encryptSensitive(data); }
  async decrypt(data: string): Promise<string> { return decryptSensitive(data); }
  mask(value: string, visibleChars?: number): string { return maskSensitive(value, visibleChars); }
  generateToken(length?: number): string { return generateToken(length); }
  obfuscateEmail(email: string): string { return obfuscateEmail(email); }

  createRetentionPolicy(input: Parameters<typeof createRetentionPolicy>[0]): RetentionPolicyDefinition { return createRetentionPolicy(input); }
  updateRetentionPolicy(id: string, updates: Parameters<typeof updateRetentionPolicy>[1]): RetentionPolicyDefinition | undefined { return updateRetentionPolicy(id, updates); }
  deleteRetentionPolicy(id: string): boolean { return deleteRetentionPolicy(id); }
  getRetentionPolicy(id: string): RetentionPolicyDefinition | undefined { return getRetentionPolicy(id); }
  listRetentionPolicies(companyId?: string): RetentionPolicyDefinition[] { return listRetentionPolicies(companyId); }
  getPolicyForEntity(companyId: string, entity: string): RetentionPolicyDefinition | undefined { return getPolicyForEntity(companyId, entity); }
}

export const securityService = new SecurityService();
