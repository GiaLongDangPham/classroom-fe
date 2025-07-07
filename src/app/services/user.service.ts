import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.response';
import { UserResponse } from '../models/response/user.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiBaseUrl + '/users';


  constructor(
      private http: HttpClient, 
      private router: Router
    ) { }

  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }, id?: Number): Observable<ApiResponse> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  changePassword(data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }, id?: Number): Observable<ApiResponse> {
    return this.http.put<any>(`${this.baseUrl}/change-password/${id}`, data);
  }

  saveToLocalStorage(user: UserResponse) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalStorage(): UserResponse | null {
    const userResponseJSON = localStorage.getItem('user'); 
    const userResponse = JSON.parse(userResponseJSON!);  
    return userResponse || null; // Trả về đối tượng rỗng nếu không có dữ liệu
  }

  getAvatarUrl(filename: string): string {
    if (!filename) {
      return '/assets/default-avatar.png'; // Default avatar
    }
    
    // Debug logging
    console.log('🖼️ Getting avatar URL for:', filename);
    console.log('🔗 Environment API base:', environment.apiBaseUrl);
    
    // Tạo URL trực tiếp, không dùng replace
    const baseUrl = 'http://localhost:8080'; // Hardcode để test
    const avatarUrl = `${baseUrl}/images/avatars/${filename}`;
    
    console.log('🔗 Generated avatar URL:', avatarUrl);
    return avatarUrl;
  }

  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  updateAvatar(avatarUrl: string): Observable<UserResponse> {
    const url = this.baseUrl + '/me/avatar';
    return this.http.put<UserResponse>(url, { avatarUrl }); // 👈 dùng object JSON
  }
}
