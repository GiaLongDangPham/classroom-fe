import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../models/request/auth-request.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../models/api.response';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
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
    private userService: UserService
  ) {}

  ngOnInit() {
  }

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
        this.authService.setToken(response.data.token);

        this.authService.getMyProfile().subscribe({
          next: (res: ApiResponse) => {  
            const user = res.data;
            if(!user) return;

            // Save the JSON string to local storage with a key (e.g., "userResponse")
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
}
