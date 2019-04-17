import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class TemplateService {

    private messageSource = new BehaviorSubject('');
    currentMessage = this.messageSource.asObservable();

    private notificationBaseUrl = environment.notificationManagementUrl;

    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded'
        })};

    constructor(private http: HttpClient) {}

    changeMessage(message: any) {
        this.messageSource.next(message)
    }

    fetch() {
        return this.http.get(`${this.notificationBaseUrl}/templates`);
    }

    fetchOne(id: string) {
        return this.http.get(`${this.notificationBaseUrl}/template/${id}`);
    }

    create(templateName: string, defaultSubject: string, defaultFrom: string, defaultFromName: string, htmlContent: string, textContent: string) {
        const body = new HttpParams()
        .set("templateName", templateName)
        .set("defaultSubject", defaultSubject)
        .set("defaultFrom", defaultFrom)
        .set("defaultFromName", defaultFromName)
        .set("htmlContent", htmlContent)
        .set("textContent", textContent);
        const url = this.notificationBaseUrl + '/template/create';
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this.http.post<any>(url, body.toString(), { headers, observe: 'response' })
            .pipe(map(response => {
                return response;
            }));
    }

    edit(templateName: string, defaultSubject: string, defaultFrom: string, defaultFromName: string, htmlContent: string, textContent: string, id: string) {
        const url = this.notificationBaseUrl + '/template/'+id+'/update';
        return this.http.put<any>(url, { templateName, defaultSubject, defaultFrom, defaultFromName, htmlContent, textContent })
            .pipe(map(response => {
                return response;
            }));
    }
    suspend(id: string) {
        const url = this.notificationBaseUrl + '/template/'+id+'/suspend';
        return this.http.put<any>(url, {  })
            .pipe(map(response => {
                return response;
            }));
    }
    unsuspend(id: string) {
        const url = this.notificationBaseUrl + '/template/'+id+'/unsuspend';
        return this.http.put<any>(url, {  })
            .pipe(map(response => {
                return response;
            }));
    }
    delete(id: string) {
        const url = this.notificationBaseUrl + '/template/'+id+'/delete';
        return this.http.delete<any>(url, {  })
            .pipe(map(response => {
                return response;
            }));
    }

}
