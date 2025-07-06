import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthRequest } from '../models/auth-request.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.response';


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

  getMyProfile(): Observable<ApiResponse> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null; // 👈 chống lỗi SSR
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    if (typeof window === 'undefined') return; // 👈 chống lỗi SSR
    localStorage.setItem('token', token);
  }

  logout() {
    if (typeof window === 'undefined') return; // 👈 chống lỗi SSR
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
