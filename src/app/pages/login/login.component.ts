import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../models/auth-request.model';
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
    // localStorage.clear(); // Clear local storage on init
  }

  onSubmit() {
    // if (this.form.invalid) return;

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
        debugger
        this.loading = false;
        this.authService.setToken(response.data.token);

        this.userService.getUserDetail(response.data.token).subscribe({
          next: (user: any) => {  
            if(user == null || !user) {
              return;
            }
            const userResponseJSON = JSON.stringify(user);  
            // Save the JSON string to local storage with a key (e.g., "userResponse")
            localStorage.setItem('user', userResponseJSON);
          },
          complete: () => {
            debugger;
          },
          error: (error: HttpErrorResponse) => {
            debugger;
            console.error(error?.error?.message ?? '');
          } 
        })

        this.router.navigate(['/classroom']);
        this.toastr.success('Đăng nhập thành công!');
      },
      error: () => {
        debugger
        this.loading = false;
        this.toastr.error('Sai tên đăng nhập hoặc mật khẩu');
      }
    });
  }
}
