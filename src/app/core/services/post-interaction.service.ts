import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostCommentResponse } from '../../shared/models/response/post-comment.response';
import { PostResponse } from '../../shared/models/response/post.response';
import { PostLikeResponse } from '../../shared/models/response/post-like.response';


@Injectable({
  providedIn: 'root'
})
export class PostInteractionService {

  private baseUrl = 'http://localhost:8080/api/v1/posts';

  constructor(
    private http: HttpClient
  ) { }

  likeOrUnlikePost(postId: number): Observable<PostLikeResponse> {
    return this.http.post<PostLikeResponse>(`${this.baseUrl}/likes/${postId}`, null);
  }
  
  getIsLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/likes/${postId}/${userId}`);
  }

  countLikes(postId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/likes/count/${postId}`);
  }

  getComments(postId: number): Observable<PostCommentResponse[]> {
    return this.http.get<PostCommentResponse[]>(`${this.baseUrl}/comments/${postId}`);
  }

  countComments(postId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/comments/count/${postId}`);
  }

  addComment(postId: number, content: string): Observable<PostCommentResponse> {
    return this.http.post<PostCommentResponse>(`${this.baseUrl}/comments/${postId}`, { content });
  }

  updateComment(commentId: number, content: string): Observable<PostCommentResponse> {
    return this.http.put<PostCommentResponse>(`${this.baseUrl}/comments/${commentId}`, { content });
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${commentId}`);
  }
}
