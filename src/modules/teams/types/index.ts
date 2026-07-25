import type { TeamSchemaType } from '../schemas/team-schema';
import type { TeamMemberSchemaType } from '../schemas/member-schema';
import type { TeamProductivitySchemaType } from '../schemas/productivity-schema';

export type Team = TeamSchemaType;
export type TeamMember = TeamMemberSchemaType;
export type TeamProductivity = TeamProductivitySchemaType;

export type TeamWithRelations = Team & {
  members?: TeamMember[];
  productivity?: TeamProductivity[];
};
