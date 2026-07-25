'use server';

import { workOrderService } from '../services/work-order-service';
import { timelineService } from '../services/timeline-service';
import { attachmentService } from '../services/attachment-service';

export async function listWorkOrders() {
  return workOrderService.list();
}

export async function getWorkOrder(id: string) {
  return workOrderService.get(id);
}

export async function createWorkOrder(data: Record<string, unknown>) {
  return workOrderService.create(data);
}

export async function updateWorkOrder(id: string, data: Record<string, unknown>) {
  return workOrderService.update(id, data);
}

export async function deleteWorkOrder(id: string) {
  await workOrderService.delete(id);
}

export async function getWorkOrderStatusCounts() {
  return workOrderService.getStatusCounts();
}

export async function listWorkOrderItems(workOrderId: string) {
  return workOrderService.listItems(workOrderId);
}

export async function createWorkOrderItem(data: Record<string, unknown>) {
  return workOrderService.createItem(data);
}

export async function updateWorkOrderItem(id: string, data: Record<string, unknown>) {
  return workOrderService.updateItem(id, data);
}

export async function deleteWorkOrderItem(id: string) {
  await workOrderService.deleteItem(id);
}

export async function listWorkOrderEvents(workOrderId: string) {
  return workOrderService.listEvents(workOrderId);
}

export async function createWorkOrderEvent(data: Record<string, unknown>) {
  return workOrderService.createEvent(data);
}

export async function listWorkOrderAttachments(workOrderId: string) {
  return attachmentService.listByWorkOrderId(workOrderId);
}

export async function createWorkOrderAttachment(data: Record<string, unknown>) {
  return attachmentService.create(data);
}

export async function deleteWorkOrderAttachment(id: string) {
  await attachmentService.delete(id);
}

export async function listTimelineByWorkOrder(workOrderId: string) {
  return timelineService.listByWorkOrderId(workOrderId);
}

export async function createTimelineEvent(data: Record<string, unknown>) {
  return timelineService.create(data);
}
