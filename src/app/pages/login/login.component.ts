import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthRequest } from '../../shared/models/request/auth-request.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { ApiResponse } from '../../shared/models/api.response';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
  ) {}

  onSubmit() {
    this.loading = true;

    const { username, password } = this.form.value;

    const loginDTO: AuthRequest = {
      username: username?.trim(),
      password: password?.trim()
    };

    if (!username || !password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      this.loading = false;
      return;
    }

    this.authService.login(loginDTO).subscribe({
      next: (response: ApiResponse) => {
        this.loading = false;
        
        if (!response.data?.token || !response.data?.refreshToken) {
          this.toastr.error('Không nhận được token hoặc refreshToken từ server');
          return;
        }
        debugger
        this.authService.setLoggedIn(true);
        this.authService.setToken(response.data.token);
        this.authService.setRefreshToken(response.data.refreshToken);

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
            this.loading = false;
            this.toastr.error('Không lấy được thông tin người dùng');
          } 
        })
      },
      error: () => {
        debugger
        this.loading = false;
        this.toastr.error('Sai tên đăng nhập hoặc mật khẩu');
      }
    });
  }

  loginWithGoogle(){
    const callbackUrl = environment.redirectUri;
    const authUrl = environment.authUrl;
    const googleClientId = environment.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);
    debugger
    window.location.href = targetUrl;
  }

  loginWithFacebook(){
  }
}
