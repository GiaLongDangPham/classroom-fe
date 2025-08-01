import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse } from '../../shared/models/api.response';
import { AuthResponse } from '../../shared/models/response/auth.response';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.scss'
})
export class AuthenticateComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    debugger
    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);
    if (isMatch) {
      const authCode = isMatch[1];
      debugger
      this.authService.outboundAuthenticate(authCode).subscribe({
        next: (res: AuthResponse) => {
          debugger
          this.authService.setLoggedIn(true);
          this.authService.setToken(res.token);
          this.authService.setRefreshToken(res.refreshToken);
          this.authService.getMyProfile().subscribe({
            next: (res: ApiResponse) => {  
              const user = res.data;
              if(!user) {
                this.toastr.error('Không lấy được thông tin người dùng');
                return;
              }

              this.userService.saveToLocalStorage(user);
              this.toastr.success('Đăng nhập thành công!');
              this.router.navigate(['/classroom']);
            },
            error: (error) => {
              console.log('Error fetching user profile:', error);
              this.toastr.error('Không lấy được thông tin người dùng');
            } 
          })
        },
        error: (err) => {
          console.error('Error during authentication:', err);
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
