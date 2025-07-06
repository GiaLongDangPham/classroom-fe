import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostCommentResponse } from '../models/response/post-comment.response';
import { PostResponse } from '../models/response/post.response';


@Injectable({
  providedIn: 'root'
})
export class PostInteractionService {

  private baseUrl = 'http://localhost:8080/api/v1/posts';

  constructor(
    private http: HttpClient
  ) { }

  likeOrUnlikePost(postId: number, isLiked: boolean): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${this.baseUrl}/${postId}/like`, null, {
      params: { isLiked: isLiked.toString() }
    });
  }
  
  getIsLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${postId}/${userId}/like`);
  }

  getComments(postId: number): Observable<PostCommentResponse[]> {
    return this.http.get<PostCommentResponse[]>(`${this.baseUrl}/${postId}/comments`);
  }

  addComment(postId: number, content: string): Observable<PostCommentResponse> {
    return this.http.post<PostCommentResponse>(`${this.baseUrl}/${postId}/comments`, { content });
  }
}
