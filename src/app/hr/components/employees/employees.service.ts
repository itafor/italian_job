import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class EmployeeService {

    constructor(private http: HttpClient) {
    }
 
    create(
        firstname: string,
        middlename: string,
        lastname: string,
        companyEmail: string,
        personalEmail: string,
        houseAddress: string,
        phone1: string,
        phone2: string,
    ) {
        const url = environment.hrUrl + '/admin/employee/create';
        return this.http.post<any>(url, { firstname, middlename, lastname, companyEmail, personalEmail, houseAddress, phone1, phone2})
            .pipe(map(status => status));
    }

    updateEmployee(
        employeeId: string,
        firstname: string,
        middlename: string,
        lastname: string,
        companyEmail: string,
        personalEmail: string,
        houseAddress: string,
        phone1: string,
        phone2: string,
        updatedFields: string[]
    ) {
        return this.http.put(`${environment.hrUrl}/admin/employee/${employeeId}`, {
            
             firstname, 
             lastname, 
            middlename,
             companyEmail, 
             personalEmail, 
             houseAddress, 
             phone1, 
             phone2,
            updatedFields })
            .pipe();
    }

    deleteEmployee(employeeId) {
        return this.http.delete(`${environment.hrUrl}/admin/employee/${employeeId}`)
    }

    fetchEmployees() {
        return this.http.get(`${environment.hrUrl}/admin/employees`)
    }

    fetchEmployee(employeeId) {
        return this.http.get(`${environment.hrUrl}/admin/employee/${employeeId}`)
    }

    assignDepartment(employeeId, departmentId) {
        return this.http.put(`${environment.hrUrl}/admin/employee/${employeeId}`, {
            departmentId,
            updatedFields: ['departmentId']
        }).pipe()
    }

    assignRole(employeeId, roleId) {
        return this.http.put(`${environment.hrUrl}/admin/employee/${employeeId}`, {
            roleId,
            updatedFields: ['roleId']
        }).pipe()
    }

    assignLeaveDaysNumber(employeeId, numberOfLeaveDays) {
        return this.http.put(`${environment.hrUrl}/admin/employee/${employeeId}`, {
            numberOfLeaveDays,
            updatedFields: ['numberOfLeaveDays']
        }).pipe()
    }

    suspend(id: string) {
        const url = environment.hrUrl + '/admin/employee/' + id + '/suspend';
        return this.http.put<any>(url, {})
            .pipe(map(response => {
                return response;
            }));
    }

    unsuspend(id: string) {
        const url = environment.hrUrl + '/admin/employee/' + id + '/unsuspend';
        return this.http.put<any>(url, {})
            .pipe(map(response => {
                return response;
            }));

    }

    uploadAttachment(file) {
        const url = environment.fileManagerUrl + '/service/upload_files';
        return this.http.post<any>(url, file)
            .pipe(map(response => {
                return response;
            }));
    }

    saveAttachment(employeeId, token, attachmentDescription) {
        const url = `${environment.hrUrl}/admin/employee/${employeeId}`;
        const data = {
            "attachment": token,
            "attachmentDescription": attachmentDescription,
            "updatedFields": ['attachment'] 
        };
        return this.http.put<any>(url, data)
            .pipe(map(response => {
                return response;
            }));
    }

    savePassport(employeeId, token) {
        const url = `${environment.hrUrl}/admin/employee/${employeeId}`;
        const data = {
            "passportPhoto": token,
            "updatedFields": ['passportPhoto']
        };
        return this.http.put<any>(url, data)
            .pipe(map(response => {
                return response;
            }));
    }


    savePayslip(employeeId, token, month, year) {
        const url = `${environment.hrUrl}/admin/employee/${employeeId}`;
        const data = {
            "payslip": token,
            "payslipMonth": month,
            "payslipYear": year,
            "updatedFields": ['payslip']
        };
        return this.http.put<any>(url, data)
            .pipe(map(response => {
                return response;
            }));
    }

    userLinking(employeeId, employeeUserId) {
        return this.http.put(`${environment.hrUrl}/admin/employee/assignUser/${employeeId}`, {
            employeeUserId
        }).pipe();
    }

    requestLeave(
        employeeUserId: string,
        leaveCategory: string,
        numberOfLeaveDays: string,
        startDate: string,

    )
    {
        const url = environment.hrUrl + '/user/leaveRequest/create';
        return this.http.post<any>(url, { employeeUserId, leaveCategory, numberOfLeaveDays, startDate })
            .pipe(map(status => status));
    }

    requestUnpaidLeave(
        comment: string,
        employeeUserId: string,
        leaveCategory: string,
        leaveTypeId: string,
        numberOfLeaveDays: string,
        startDate: string,

    ) {
        const url = environment.hrUrl + '/user/leaveRequest/create';
        return this.http.post<any>(url, { comment, employeeUserId, leaveCategory, leaveTypeId, numberOfLeaveDays, startDate })
            .pipe(map(status => status));
    }


}
