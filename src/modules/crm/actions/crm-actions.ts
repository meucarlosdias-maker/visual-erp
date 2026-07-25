'use server';

import { leadService } from '../services/lead-service';
import { activityService } from '../services/activity-service';
import { visitService } from '../services/visit-service';

export async function listLeads() {
  return leadService.list();
}

export async function getLead(id: string) {
  return leadService.get(id);
}

export async function createLead(data: Record<string, unknown>) {
  return leadService.create(data);
}

export async function updateLead(id: string, data: Record<string, unknown>) {
  return leadService.update(id, data);
}

export async function deleteLead(id: string) {
  await leadService.delete(id);
}

export async function getLeadStatusCounts() {
  return leadService.getStatusCounts();
}

export async function listActivitiesByLead(leadId: string) {
  return activityService.listByLeadId(leadId);
}

export async function createActivity(data: Record<string, unknown>) {
  return activityService.create(data);
}

export async function updateActivity(id: string, data: Record<string, unknown>) {
  return activityService.update(id, data);
}

export async function deleteActivity(id: string) {
  await activityService.delete(id);
}

export async function listVisits(leadId?: string) {
  return visitService.listByLead(leadId);
}

export async function getVisit(id: string) {
  return visitService.get(id);
}

export async function createVisit(data: Record<string, unknown>) {
  return visitService.create(data);
}

export async function updateVisit(id: string, data: Record<string, unknown>) {
  return visitService.update(id, data);
}

export async function deleteVisit(id: string) {
  await visitService.delete(id);
}

export async function listVisitAttachments(visitId: string) {
  return visitService.listAttachments(visitId);
}

export async function createVisitAttachment(data: Record<string, unknown>) {
  return visitService.createAttachment(data);
}

export async function deleteVisitAttachment(id: string) {
  await visitService.deleteAttachment(id);
}
