import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PostRequest } from '../models/request/post.request';
import { PostResponse } from '../models/response/post.response';
import { ApiResponse } from '../models/api.response';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = environment.apiBaseUrl + '/posts';

   constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  // POST /create
  createPost(postData: PostRequest): Observable<ApiResponse> {
    return this.http.post(this.baseUrl, postData);
  }

  // GET /classrooms/:classroomId/posts
  getPostsByClassId(classroomId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/class/${classroomId}`);
  }
}
