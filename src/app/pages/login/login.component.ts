import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthRequest } from '../../shared/models/request/auth-request.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { ApiResponse } from '../../shared/models/api.response';
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
        console.log('Login response:', response);
        this.loading = false;
        
        if (!response.data?.token) {
          this.toastr.error('Không nhận được token từ server');
          return;
        }
        
        this.authService.setToken(response.data.token);
        console.log('Token saved:', localStorage.getItem('token'));

        this.authService.getMyProfile().subscribe({
          next: (res: ApiResponse) => {  
            console.log('👤 Profile response:', res);
            const user = res.data;
            if(!user) {
              this.toastr.error('Không lấy được thông tin người dùng');
              return;
            }

            // Save the JSON string to local storage with a key (e.g., "userResponse")
            this.userService.saveToLocalStorage(user);
            console.log('👤 User saved to localStorage:', localStorage.getItem('user'));
            
            this.toastr.success('Đăng nhập thành công!');
            
            console.log('🚀 Navigating to /classroom...');
            this.router.navigate(['/classroom']).then(
              (success) => {
                console.log('🚀 Navigation success:', success);
              },
              (error) => {
                console.error('🚀 Navigation error:', error);
              }
            );
          },
          error: (error) => {
            console.error('👤 Profile error:', error);
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
