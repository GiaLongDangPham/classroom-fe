import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthRequest } from '../../shared/models/request/auth-request.model';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../../shared/models/api.response';
import { AuthResponse } from '../../shared/models/response/auth.response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl + '/auth';
  constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  login(request: AuthRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/login`, request);
  }

  register(request: AuthRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/refresh-token`, 
      {refreshToken} 
    ).pipe(
      tap((res) => {
        this.setToken(res.token);
        this.setRefreshToken(res.refreshToken); // nếu có thay mới
      })
    );
  }

  getMyProfile(): Observable<ApiResponse> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null; // SSR check
    
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null; // SSR check

    return localStorage.getItem('refreshToken');
  }

  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  }

  setRefreshToken(refreshToken: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', refreshToken);
  }

  logout() {
    if (typeof window === 'undefined') return; // 👈 chống lỗi SSR
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
