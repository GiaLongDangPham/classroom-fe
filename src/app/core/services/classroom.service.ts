import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ClassroomRequest } from '../../shared/models/request/classroom.model';
import { ApiResponse } from '../../shared/models/api.response';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private baseUrl = environment.apiBaseUrl + '/classrooms';
  
  constructor(
    private http: HttpClient, 
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
  getMyClasses(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/my-classes`);
  }

  // GET /:id
  getClassDetail(id: number): Observable<ApiResponse> {
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

  // GET /classrooms/explore
  getExploreClasses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/explore`);
  }
}
