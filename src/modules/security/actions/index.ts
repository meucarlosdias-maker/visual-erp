'use client';

import type { AuditInput, PolicyInput, PolicyUpdate, RetentionInput, RetentionUpdate } from '../schemas';
import { securityModuleService } from '../services';

export async function listAuditEvents() { return securityModuleService.listAuditEvents(); }
export async function getAuditEvent(id: string) { return securityModuleService.getAuditEvent(id); }
export async function createAudit(input: AuditInput) { return securityModuleService.createAudit(input); }

export async function listAccessLogs() { return securityModuleService.listAccessLogs(); }

export async function listPolicies() { return securityModuleService.listPolicies(); }
export async function getPolicy(id: string) { return securityModuleService.getPolicy(id); }
export async function createPolicy(input: PolicyInput) { return securityModuleService.createPolicy(input); }
export async function updatePolicy(id: string, input: PolicyUpdate) { return securityModuleService.updatePolicy(id, input); }
export async function deletePolicy(id: string) { return securityModuleService.deletePolicy(id); }

export async function listRetentionPolicies() { return securityModuleService.listRetentionPolicies(); }
export async function getRetentionPolicy(id: string) { return securityModuleService.getRetentionPolicy(id); }
export async function createRetentionPolicy(input: RetentionInput) { return securityModuleService.createRetentionPolicy(input); }
export async function updateRetentionPolicy(id: string, input: RetentionUpdate) { return securityModuleService.updateRetentionPolicy(id, input); }
export async function deleteRetentionPolicy(id: string) { return securityModuleService.deleteRetentionPolicy(id); }

export async function getCompliance(framework: string) { return securityModuleService.getCompliance(framework as Parameters<typeof securityModuleService.getCompliance>[0]); }
export async function listFrameworks() { return securityModuleService.listFrameworks(); }
export async function getAllCompliance() { return securityModuleService.getAllCompliance(); }
