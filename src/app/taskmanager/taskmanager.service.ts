import { AuthenticationService } from 'src/app/account/account.authentication';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { mapRawMembersToExpectedDetailsOfMembers, DetailsOfMembersOfProjectInt } from './interfaces';
import { LogHourEnum } from './enums';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {

  baseUrl = environment.taskManagerUrl;
  fileManagerBaseUrl = environment.fileManagerUrl;
  userManagerBaseUrl = environment.userManagementUrl;
  user;
  task;
  private membersInProject: {[key: string]: DetailsOfMembersOfProjectInt[]} = {};

  constructor(private http: HttpClient,
    public auth: AuthenticationService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  get token() {
    return;
  }

  public setTaskRouted(task: any) {
    this.task = task;
  }

  get TaskRouted() {
    return this.task;
  }

  getAllUser() {
    const url = this.userManagerBaseUrl + '/users/all';
    return this.http.get<any>(url, {})
      .pipe(map(response => {
        return response;
      }));
  }

  deleteData(endpoint: string) {
    const url = this.baseUrl + endpoint;
    return this.http.delete<any>(url, {})
      .pipe(map(response => {
        return response;
      }));
  }

  getUserData(uid: string) {
    const url = this.userManagerBaseUrl + '/' + uid;
    return this.http.get<any>(url, {})
      .pipe(map(response => {
        return response;
      }));
  }

  fetchCapabilities() {
    return this.http.get(`${this.baseUrl}/admin/capabilities`);
  }

  fetchRole() {
    return this.http.get(`${this.baseUrl}/admin/roles`);
  }

  createRole(name, capabilities) {
    const url = this.baseUrl + '/admin/role';
    return this.http.post<any>(url, { name, capabilities })
      .pipe(map(response => {
        return response;
      }));
  }
  editRole(name: string, capabilities: string[], roleId: string) {
    const url = this.baseUrl + '/role/' + roleId + '/update/';
    return this.http.put<any>(url, { name, capabilities })
      .pipe(map(response => {
        return response;
      }));
  }

  fetchProjects() {
    return this.http.get(`${this.baseUrl}/admin/projects`);
  }

  createProject(name: string) {
    const url = this.baseUrl + '/admin/project/create';
    return this.http.post<any>(url, { name })
      .pipe(map(response => {
        return response;
      }));
  }
  editProject(name: string, projectId: string, updatedFields: string[]) {
    const url = this.baseUrl + '/project/' + projectId + '/update/';
    return this.http.put<any>(url, { name, updatedFields })
      .pipe(map(response => {
        return response;
      }));
  }

  addDescriptionProject(
    projectId: string,
    description: string,
    updatedFields: string[]) {
    return this.http.put<any>(`${this.baseUrl}/project/${projectId}/update`,
      {
        description,
        updatedFields
      })
      .pipe(map(response => {
        return response;
      }));
  }

  deleteProject(projectId: string) {
    const url = this.baseUrl + '/project/' + projectId;
    return this.http.delete<any>(url, {})
      .pipe(map(response => {
        return response;
      }));
  }

  addUserToProject(projectId, userData, roleSelected) {
    const data = {
      'roleId': roleSelected.id,
      'userEmail': userData.email,
      'userFullname': userData.firstname + ' ' + userData.lastname,
      'userId': userData.id
    };
    const url = this.baseUrl + '/admin/project/' + projectId + '/attach_user';
    return this.http.post<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }



  fetchTaskboardColumns(id: string) {
    return this.http.get(`${this.baseUrl}/project/${id}`);
  }

  addColumnToTaskboard(name: string, id: string) {
    const url = this.baseUrl + '/project/' + id;
    return this.http.put<any>(url, { name })
      .pipe(map(response => {
        return response;
      }));
  }

  renameColumn(projectId: string, name: string, id: string) {
    const url = this.baseUrl + '/project/' + projectId + '/column/' + id;
    return this.http.put<any>(url, { name })
      .pipe(map(response => {
        return response;
      }));
  }

  repositionColumn(columnIdList: any, projectId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/column/reposition/';
    return this.http.put<any>(url, { columnIdList })
      .pipe(map(response => {
        return response;
      }));
  }

  fetchTask(projectId: string, id: string) {
    return this.http.get(`${this.baseUrl}/project/${projectId}/task/${id}`);
  }

  createTaskOnTaskboard(projectId: string, summary: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/';
    return this.http.post<any>(url, { summary })
      .pipe(map(response => {
        return response;
      }));
  }

  createSubTask(projectId: string, summary: string, taskId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId;
    const data = { 'subTask': summary, 'updatedFields': ['subTask'] };
    return this.http.put<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }

  updateSubTask(projectId: string, summary: string, subTaskuuid: string, taskId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/subtask/' + taskId + '/' + subTaskuuid;
    return this.http.put<any>(url, { summary })
      .pipe(map(response => {
        return response;
      }));
  }

  createTaskComment(projectId: string, comment: string, taskId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId;
    const data = { 'comment': comment, 'updatedFields': ['comment'] };
    return this.http.put<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }

  updateTaskComment(projectId: string, taskId: string, commentUuid: string, comment: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/project/${projectId}/comment/${taskId}/${commentUuid}`,
    {comment});
  }

  actionTaskWatcher(projectId: string, status, taskId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId;
    const data = { 'watcher': status, 'updatedFields': ['watcher'] };
    return this.http.put<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }

  updateAssignee(projectId: string, id, fullname, email, taskId) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId;
    const data = {
      'assignee': {
        'userId': id,
        'userName': fullname,
        'userEmail': email
      },
      'updatedFields': ['assignee']
    };
    return this.http.put<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }

  updateTaskDescription(projectId: string, description: string, taskId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId;
    const data = { 'description': description, 'updatedFields': ['description'] };
    return this.http.put<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }

  updateTaskSummary(projectId: string, summary: string, taskId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId;
    const data = { 'summary': summary, 'updatedFields': ['summary'] };
    return this.http.put<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }

  rearrangeTaskPosition(projectId: string, taskId: string, columnId: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId + '/move';
    return this.http.put<any>(url, { columnId })
      .pipe(map(response => {
        return response;
      }));
  }

  rearrangeTaskPositionVertically(projectId: string, taskId: string, newPosition: string) {
    const url = this.baseUrl + '/project/' + projectId + '/task/reposition';
    console.log('Url', url);
    console.log('TaskId', taskId);
    console.log('New Position', newPosition);
    return this.http.put<any>(url, { taskId, newPosition })
      .pipe(map(response => {
        return response;
      }));
  }

  uploadAttachment(attachmentFormData) {
    const url = this.fileManagerBaseUrl + '/service/upload_files';
    return this.http.post<any>(url, attachmentFormData)
      .pipe(map(response => {
        return response;
      }));
  }

  saveAttachment(projectId: string, token, taskId) {
    const url = this.baseUrl + '/project/' + projectId + '/task/' + taskId;
    const data = { 'attachments': token, 'updatedFields': ['attachments'] };
    return this.http.put<any>(url, data)
      .pipe(map(response => {
        return response;
      }));
  }

  createGoal(
    projectId: string,
    description: string,
    name: string,
    startDate: Date,
    stopDate: Date,

  ) {

    return this.http.post<any>(`${this.baseUrl}/project/${projectId}/goal`, { description, name, startDate, stopDate })
      .pipe(map(status => status));
  }

  updateGoal(
    projectId: string,
    goalId: string,
    name: string,
    description: string,
    startDate: Date,
    stopDate: Date,
    updatedFields: string[]
  ) {
    return this.http.put(`${this.baseUrl}/project/${projectId}/goal/${goalId}`, {
      name,
      description,
      startDate,
      stopDate,
      updatedFields
    })
      .pipe();
  }

  createField(
    projectId: string,
    description: string,
    name: string,
    type: string,


  ) {
    return this.http.post<any>(`${this.baseUrl}/project/${projectId}/fields`, { description, name, type })
      .pipe(map(status => status));
  }


  updateFields(
    projectId: string,
    fieldId: string,
    description: string,
    name: string,
    type: string,
    updatedFields: string[]
  ) {
    return this.http.put(`${this.baseUrl}/project/${projectId}/field/${fieldId}`, {
      name,
      description,
      type,
      updatedFields
    })
      .pipe();
  }



  fetchGoals(projectId: string) {
    return this.http.get(`${this.baseUrl}/project/${projectId}/goals`);
  }


  fetchGoal(projectId: string, goalId: string) {
    return this.http.get(`${this.baseUrl}/project/${projectId}/goal/${goalId}`);
  }

  fetchFields(projectId: string) {
    return this.http.get(`${this.baseUrl}/project/${projectId}/fields`);
  }

  addMembers(
    id: string,
    roleId: string,
    userEmail: string,
    userFullname: string,
    userId: string) {
    return this.http.post(`${this.baseUrl}/admin/project/${id}/attach_user`,
    {
      roleId, userEmail, userFullname, userId
    }).pipe();
  }

  fetchMembers(id: string) {
    return this.http.get(`${this.baseUrl}/admin/project/${id}/attached_users`);
  }

  populateDetailsOfMembersInProject(projectId): void {
    this.fetchMembers(projectId).subscribe(
      succRes => {
        const { currentUserValue } = this.auth;
        const membersWithAdmin = mapRawMembersToExpectedDetailsOfMembers(succRes['data']);
        if ((currentUserValue.roles || []).indexOf('ADMIN') > -1) {
          membersWithAdmin.push({ fullname: `${currentUserValue.firstName} ${currentUserValue.lastName}`,
          id: `${currentUserValue.id}`, email: currentUserValue.username });
        }
        this.membersInProject[projectId] = membersWithAdmin;
       },
      errRes => { console.log(errRes); }
    );
  }

  membersOfProject(projectId: string) {
    return this.membersInProject[projectId];
  }


  getAttachUrlWithToken(origUrl: string): string {
    return `${origUrl}?token=${this.auth.currentUserValue.token}`;
  }

  genericUpdateTask(updateObj: { taskId: string, projectId: string, updatedFields: string[] },
    newData: { [key: string]: any }): Observable<any> {
    const url = `${this.baseUrl}/project/${updateObj.projectId}/task/${updateObj.taskId}`;
    const data = { ...newData, updatedFields: updateObj.updatedFields };
    return this.http.put<any>(url, data)
      .pipe();
  }

  atttachTaskToGoal(attachObj: { goalId: string; taskId: string, projectId: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/project/${attachObj.projectId}/goal/${attachObj.goalId}/attach-task`,
    {taskId: attachObj.taskId});
  }

  updateLoggedHours(projectId, taskId, logHourObj: {logDate: Date; logNumber: number; logType: LogHourEnum} ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/project/${projectId}/task/${taskId}/log-hour`, logHourObj);
  }

  fetchLoggedHours(projectId: string, taskId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/project/${projectId}/task/${taskId}/log-hour`);
  }
}
