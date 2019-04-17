import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizId: string;
  user: any;

  constructor(public http: HttpClient) {
    // store token for temp BE
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  appendAuthHeader(): any {
    return {
      headers: {
        Authorization: `Bearer ${this.user.token}`
      }
    };
  }

  setId(id) {
    this.quizId = id;
  }

  get id(): string {
    return this.quizId;
  }

  clearId() {
    this.quizId = null;
  }

  create(title: string, description: string, visibility: string) {}

  postQuestion(quizId: string, data): Observable<any> {
    return this.http
      .post<any>(
        `${environment.quizUrl}/quizzes/${quizId}/questions`,
        data,
        this.appendAuthHeader()
      )
      .pipe();
  }
  getQuestionMeta(id) {
    return this.http.get(
      `https://p-quiz-api-dev.quabbly.com/api/v1/quizzes/${id}/meta`
    );
  }

  getQuizMeta(quizId: string, id): Observable<any> {
    return this.http
      .get<any>(
        `${environment.quizUrl}/quizzes/${quizId}/meta`,

        this.appendAuthHeader()
      )
      .pipe();
  }

  listQuiz(): Observable<any> {
    return this.http
      .get<any>(`${environment.quizUrl}/quizzes`, this.appendAuthHeader())
      .pipe();
  }

  listQuizes(): Observable<any> {
    return this.http
      .get<any>(`${environment.quizUrl}/quizzes`, this.appendAuthHeader())
      .pipe();
  }

  getQuiz(quizId: string): Observable<any> {
    return this.http
      .get<any>(
        `${environment.quizUrl}/quizzes/${quizId}`,
        this.appendAuthHeader()
      )
      .pipe();
  }
  getQuizSetting(quizId) {
    return this.http
      .get(
        `${environment.quizUrl}/quizzes/${quizId}/settings`,
        this.appendAuthHeader()
      )
      .pipe();
  }

  getQuizQuestionList() {
    return this.http
      .get(
        `${
          environment.quizUrl
        }/quizzes/${`5c77cc6717ee6e000e5b4fe6`}/questions`,
        this.appendAuthHeader()
      )
      .pipe();
  }

  publishStep(index: string, id, data): Observable<any> {
    console.log(this.id);
    if (index.toLowerCase() === 'one') {
      return this.http
        .post<any>(
          `${environment.quizUrl}/quizzes/step_${index}`,
          {
            ...data,
            id: this.id
          },
          this.appendAuthHeader()
        )
        .pipe();
    } else {
      return this.http
        .put<any>(
          `${environment.quizUrl}/quizzes/${this.id}/step_${index}`,
          data,
          this.appendAuthHeader()
        )
        .pipe();
    }
  }
}
