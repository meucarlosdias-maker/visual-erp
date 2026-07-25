import type {
  LeadSchemaType, LeadActivitySchemaType,
  VisitSchemaType, VisitAttachmentSchemaType, MeasurementSchemaType,
} from '../schemas';
import type { LeadStatus, LeadTemperature, ActivityType, VisitStatus } from '../schemas';

export type { LeadStatus, LeadTemperature, ActivityType, VisitStatus };
export type Lead = LeadSchemaType;
export type LeadActivity = LeadActivitySchemaType;
export type Visit = VisitSchemaType;
export type VisitAttachment = VisitAttachmentSchemaType;
export type Measurement = MeasurementSchemaType;
