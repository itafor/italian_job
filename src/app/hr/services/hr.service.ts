import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HrService {

  user;
  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  get token() {
    return
  }

  createRole(rolename) {
    return this.http.post(`${environment.hrUrl}/admin/role/create`, {
      name: rolename
    }).pipe()
  }

  fetchRoles() {
    return this.http.get(`${environment.hrUrl}/admin/roles`)
  }

  fetchRole(roleId) {
    return this.http.get(`${environment.hrUrl}/admin/role/${roleId}`)
  }

  updateRole(roleId, rolename) {
    return this.http.put(`${environment.hrUrl}/admin/role/${roleId}`, {
      name: rolename,
    }).pipe();
  }


  createDepartment(departmentname) {
    return this.http.post(`${environment.hrUrl}/admin/department/create`, {
      name: departmentname
    }).pipe()
  }

  createEvent(
    description: string,
    name: string,
    startTime: Date,
    stopTime: Date,

  ) {
    const url = environment.hrUrl + '/admin/event/create';
    return this.http.post<any>(url, { description, name, startTime, stopTime })
      .pipe(map(status => status));
  }

  fetchEvents() {
    return this.http.get(`${environment.hrUrl}/admin/events`)
  }


  updateEvent(
    eventId: string,
    name: string,
    description: string,
    startTime: Date,
    stopTime: Date,
  ) {
    return this.http.put(`${environment.hrUrl}/admin/event/${eventId}`, {
      name,
      description,
      startTime,
      stopTime
    })
      .pipe();
  }

  deleteEvent(eventId) {
    return this.http.delete(`${environment.hrUrl}/admin/event/${eventId}`)
  }

  suspendEvent(id: string) {
    const url = environment.hrUrl + '/admin/event/' + id + '/suspend';
    return this.http.put<any>(url, {})
      .pipe(map(response => {
        return response;
      }));
  }

  unsuspendEvent(id: string) {
    const url = environment.hrUrl + '/admin/event/' + id + '/unsuspend';
    return this.http.put<any>(url, {})
      .pipe(map(response => {
        return response;
      }));

  }



  fetchDepartments() {
    return this.http.get(`${environment.hrUrl}/admin/departments`)
  }

  fetchDepartment(departmentId) {
    return this.http.get(`${environment.hrUrl}/admin/department/${departmentId}`)
  }


  updateDepartment(departmentId, departmentname) {
    return this.http.put(`${environment.hrUrl}/admin/department/${departmentId}`, {
      name: departmentname,
    }).pipe();
  }

  deleteDepartment(departmentId) {
    return this.http.delete(`${environment.hrUrl}/admin/department/${departmentId}`)
  }


  deleteRole(roleId) {
    return this.http.delete(`${environment.hrUrl}/admin/role/${roleId}`)
  }

  assignDepartmentLead(deptId, departmentLeadId, departmentname) {
    return this.http.put(`${environment.hrUrl}/admin/department/${deptId}`, {
      departmentLeadId,
      name: departmentname,
    }).pipe();
  }

  assignParentDepartment(deptId, parentDepartmentId, departmentname) {
    return this.http.put(`${environment.hrUrl}/admin/department/${deptId}`, {
      parentDepartmentId,
      name: departmentname,
    }).pipe();
  }


  suspend(id: string) {
    const url = environment.hrUrl + '/admin/department/' + id + '/suspend';
    return this.http.put<any>(url, {})
      .pipe(map(response => {
        return response;
      }));
  }

  unsuspend(id: string) {
    const url = environment.hrUrl + '/admin/department/' + id + '/unsuspend';
    return this.http.put<any>(url, {})
      .pipe(map(response => {
        return response;
      }));

  }

  fetchLeaves() {
    return this.http.get(`${environment.hrUrl}/admin/leaveTypes`)
  }

  createLeave(
    name: string,
    numberOfDays: string

  ) {
    const url = environment.hrUrl + '/admin/leaveType/create';
    return this.http.post<any>(url, { name, numberOfDays })
      .pipe(map(status => status));
  }


  updateLeave(
    leaveTypeId: string,
    name: string,
    numberOfDays: string,
    updatedFields: string[]
  ) {
    return this.http.put(`${environment.hrUrl}/admin/leaveType/${leaveTypeId}`, {
      name,
      numberOfDays,
      updatedFields
    })
      .pipe();
  }

  deleteLeave(leaveTypeId) {
    return this.http.delete(`${environment.hrUrl}/admin/leaveType/${leaveTypeId}`)
  }

}