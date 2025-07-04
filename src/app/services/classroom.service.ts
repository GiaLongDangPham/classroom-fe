import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ClassroomRequest } from '../models/classroom.model';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private baseUrl = environment.apiBaseUrl + '/classrooms';
  
  constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  // POST /create
  createClass(payload: ClassroomRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, payload);
  }

  // POST /join?joinCode=XXXX
  joinClass(joinCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/join`, null, {
      params: { joinCode }
    });
  }

  // GET /my-classes
  getMyClasses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-classes`);
  }

  // GET /:id
  getClassDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // DELETE /:id
  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // DELETE /leave/:classId
  leaveClass(classId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/leave/${classId}`);
  }
}
