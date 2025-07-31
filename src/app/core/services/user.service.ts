import { Inject, Injectable, PLATFORM_ID  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api.response';
import { UserResponse } from '../../shared/models/response/user.response';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiBaseUrl + '/users';

  private userSubject = new BehaviorSubject<UserResponse | null>(null);
  public user$ = this.userSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          this.userSubject.next(parsedUser);
        } catch (e) {
          console.error('Không parse được user từ localStorage');
        }
      }
    }
  }

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
    this.userSubject.next(user);
  }

  getUserFromLocalStorage(): UserResponse | null {
    const userResponseJSON = localStorage.getItem('user'); 
    const userResponse = JSON.parse(userResponseJSON!);  
    return userResponse || null; // Trả về đối tượng rỗng nếu không có dữ liệu
  }

  deleteUserFromLocalStorage() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getAvatarUrl(filename: string): string {
    if (!filename) {
      return '/assets/default-avatar.png'; // Default avatar
    }
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
    return this.http.put<UserResponse>(url, { avatarUrl });
  }
}
