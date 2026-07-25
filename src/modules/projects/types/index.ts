import type { ProjectSchemaType, ProjectTaskSchemaType, DepartmentSchemaType } from '../schemas';
import type { ProjectStatus, TaskStatus } from '../schemas';

export type { ProjectStatus, TaskStatus };
export type Project = ProjectSchemaType;
export type ProjectTask = ProjectTaskSchemaType;
export type Department = DepartmentSchemaType;
