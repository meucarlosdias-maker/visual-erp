import type { GovernanceApproval } from '../types';

const approvals: GovernanceApproval[] = [];

export function requestApproval(input: Omit<GovernanceApproval, 'id' | 'createdAt' | 'updatedAt' | 'approvedBy'>): GovernanceApproval {
  const entry: GovernanceApproval = {
    ...input,
    id: crypto.randomUUID(),
    approvedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  approvals.push(entry);
  return entry;
}

export function approve(id: string, userId: string): GovernanceApproval | undefined {
  const idx = approvals.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  approvals[idx] = { ...approvals[idx], status: 'approved', approvedBy: userId, updatedAt: new Date() };
  return approvals[idx];
}

export function reject(id: string, userId: string): GovernanceApproval | undefined {
  const idx = approvals.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  approvals[idx] = { ...approvals[idx], status: 'rejected', approvedBy: userId, updatedAt: new Date() };
  return approvals[idx];
}

export function listApprovals(companyId?: string): GovernanceApproval[] {
  let result = [...approvals];
  if (companyId) result = result.filter((a) => a.companyId === companyId);
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getApproval(id: string): GovernanceApproval | undefined {
  return approvals.find((a) => a.id === id);
}
