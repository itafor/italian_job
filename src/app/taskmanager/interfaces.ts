import { DetailsOfOrganizationInt } from './../interfaces';
import { Priority, FieldTypes } from './enums';
// All date fields should be cast to JS Date first
export interface AssigneeDetails {
  createdTime: string;
  userEmail: string;
  userId: string;
  userName: string;
}

export interface CommentDetails {
  comment: string;
  createdAt: string;
  lastUpdatedTime: string;
  userId: string;
  userName: string;
  userEmail: string;
  uuid: string;
}

export interface SubTask {
  createdTime: string;
  lastUpdatedTime: string;
  summary: string;
  userId: string;
  userName: string;
  uuid: string;
}

export interface WatcherDetails {
  createdTime: string;
  lastUpdatedTime?: string;
  userEmail: string;
  userId: string;
  userName: string;
}

export interface AttachmentDetails {
  created: string;
  filename: string;
  id: string;
  mimetype: string;
  size: string;
  url: string;
}

export interface TaskDetailsInterface {
  assignee: AssigneeDetails;
  description: string;
  subTasks: SubTask[];
  summary: string; // task name
  watchers: WatcherDetails[];
  taskLog: any[];
  comments: CommentDetails[];
  attachments: AttachmentDetails[];
  priority?: Priority;
}

export interface Columns {
  columnSecret: {
    name: string;
    usersId: string;
  };
  createdTime: string;
  id: string;
  lastUpdatedTime: string;
  position: number;
  projectId: string;
  visibility: boolean;
}

// map bE date to JS Date
export interface TaskInterface {
  id: string;
  taskSecret: TaskDetailsInterface;
  goal?: Goal;
  createdTime: string;
  columnId: string;
  lastUpdatedTime?: string;
  position: number;
  projectId: string;
  taskUniqueKey: string;
  tenantId: string;
  userId: string;
  columns?: Columns[];
  userName: string; // this is email
}

export interface Project {
  createdTime: string;
  id: string;
  lastUpdatedTime?: null;
  projectSecret: ProjectDetails;
  uniqueKey: string;
}

export interface ProjectDetails {
  description?: string;
  name: string;
  projectLog: any[];
}

export interface UiState {
  loading: boolean;
  error: string;
  addingSubtask: boolean;
  commentLoading: boolean;
}

export interface ApiLoadingOrError {
  loading: boolean;
  error?: boolean;
  message?: string;
}

export interface GoalDetails {
  description: string;
  name: string;
  startDate: string;
  stopDate: string;
  taskList?: TaskInterface[];
}

export interface Goal {
  goalSecret: GoalDetails;
  id: string;
  projectId: string;
}

export const defaultApiLoadingOrErrorState: ApiLoadingOrError  = {
  loading: false,
  error: false,
  message: null
};

export interface DetailsOfMembersOfProjectInt {
  fullname: string;
  id: string;
  email: string;
}

export interface Field {
  createdTime: string;
  fieldsSecret: FieldDetails;
  id: string;
  lastModifiedTime?: string;
  projectId: string;
}

export interface FieldDetails {
  description: string;
  name: string;
  type: FieldTypes;
  value: string | Date | number;
}

export function mapRawMembersToExpectedDetailsOfMembers(members: any[]): DetailsOfMembersOfProjectInt[] {
  return members.map(m => {
    return {
      fullname: m['projectUserSecret']['fullname'] || '',
      email: m['projectUserSecret']['email'] || '',
      id: m['id'] || ''
    };
  });
}
