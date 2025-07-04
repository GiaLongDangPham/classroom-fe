import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl + '/auth';
  constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request);
  }

  register(request: AuthRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
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
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
