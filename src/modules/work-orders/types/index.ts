import type {
  WorkOrderSchemaType, WorkOrderItemSchemaType,
  WorkOrderAttachmentSchemaType, WorkOrderEventSchemaType,
} from '../schemas';
import type { WorkOrderStatus } from '../schemas';

export type { WorkOrderStatus };
export type WorkOrder = WorkOrderSchemaType;
export type WorkOrderItem = WorkOrderItemSchemaType;
export type WorkOrderAttachment = WorkOrderAttachmentSchemaType;
export type WorkOrderEvent = WorkOrderEventSchemaType;
