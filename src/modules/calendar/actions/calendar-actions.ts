'use server';

import { calendarEventService } from '../services/calendar-event-service';
import { schedulingService } from '../services/scheduling-service';
import { calendarParticipantService } from '../services/calendar-participant-service';

export async function listCalendarEvents() {
  return calendarEventService.list();
}

export async function getCalendarEvent(id: string) {
  return calendarEventService.get(id);
}

export async function createCalendarEvent(data: Record<string, unknown>) {
  return calendarEventService.create(data);
}

export async function updateCalendarEvent(id: string, data: Record<string, unknown>) {
  return calendarEventService.update(id, data);
}

export async function deleteCalendarEvent(id: string) {
  await calendarEventService.delete(id);
}

export async function listEventsByDateRange(start: Date, end: Date) {
  return calendarEventService.listByDateRange(start, end);
}

export async function listEventsByDate(date: Date) {
  return calendarEventService.listByDate(date);
}

export async function getCalendarTypeCounts() {
  return calendarEventService.getTypeCounts();
}

export async function getCalendarDashboardStats() {
  return calendarEventService.getDashboardStats();
}

export async function checkScheduleConflicts(startDate: Date, endDate: Date, excludeEventId?: string) {
  return schedulingService.checkConflicts(startDate, endDate, excludeEventId);
}

export async function getScheduleForDate(date: Date) {
  return schedulingService.getScheduleForDate(date);
}

export async function getScheduleForDateRange(start: Date, end: Date) {
  return schedulingService.getScheduleForDateRange(start, end);
}

export async function listParticipantsByEvent(eventId: string) {
  return calendarParticipantService.listByEventId(eventId);
}

export async function listParticipantsByUser(userId: string) {
  return calendarParticipantService.listByUserId(userId);
}

export async function createParticipant(data: Record<string, unknown>) {
  return calendarParticipantService.create(data);
}

export async function updateParticipant(id: string, data: Record<string, unknown>) {
  return calendarParticipantService.update(id, data);
}

export async function deleteParticipant(id: string) {
  await calendarParticipantService.delete(id);
}

export async function deleteParticipantsByEvent(eventId: string) {
  await calendarParticipantService.deleteByEventId(eventId);
}
