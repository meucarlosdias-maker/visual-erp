'use client';

import type { JobInput, JobUpdate, ScheduledJobInput } from '../schemas';
import { jobModuleService } from '../services';

export async function listJobs() { return jobModuleService.listJobs(); }
export async function getJob(id: string) { return jobModuleService.getJob(id); }
export async function createJob(input: JobInput) { return jobModuleService.createJob(input); }
export async function updateJob(id: string, input: JobUpdate) { return jobModuleService.updateJob(id, input); }
export async function deleteJob(id: string) { return jobModuleService.deleteJob(id); }

export async function listExecutions(jobId?: string) { return jobModuleService.listExecutions(jobId); }
export async function listSchedules() { return jobModuleService.listSchedules(); }
export async function getSchedule(id: string) { return jobModuleService.getSchedule(id); }
export async function createSchedule(input: ScheduledJobInput) { return jobModuleService.createSchedule(input); }
export async function updateSchedule(id: string, input: Partial<ScheduledJobInput>) { return jobModuleService.updateSchedule(id, input); }
export async function deleteSchedule(id: string) { return jobModuleService.deleteSchedule(id); }
export async function listEvents() { return jobModuleService.listEvents(); }
