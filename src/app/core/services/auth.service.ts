import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthRequest } from '../../shared/models/request/auth-request.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../../shared/models/api.response';
import { AuthResponse } from '../../shared/models/response/auth.response';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl + '/auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router,
    private userService: UserService
  ) { }

  login(request: AuthRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/login`, request);
  }

  outboundAuthenticate(code: String): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/outbound/authentication?code=${code}`, { code });
  }

  register(request: AuthRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }
  
  logout() {
    if (typeof window === 'undefined') return;
    const accessToken = this.getToken();
    this.isLoggedInSubject.next(false); // Update login state
    this.http.post(`${this.baseUrl}/logout`, { accessToken }).subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.userService.deleteUserFromLocalStorage(); // Clear user data

    this.router.navigate(['/login']);
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
        console.log('Token refreshed successfully');
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

  setLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
