import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../models/request/auth-request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required]],
    confirmPassword: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['STUDENT', Validators.required]
  }, {
    validators: [this.matchPasswords]
  });

  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // Validator để đảm bảo password và confirmPassword giống nhau
  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      this.loading = false;
      return;
    }

    this.loading = true;
    const { username, password, firstName, lastName, email, role } = this.form.value;

    // Kiểm tra các giá trị bắt buộc
    if (!username || !password || !firstName || !lastName || !email || !role) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      this.loading = false;
      return;
    }

    const payload: AuthRequest = {
      username,
      password,
      firstName,
      lastName,
      email,
      role
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
        this.toastr.success('Đăng ký thành công!');
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Đăng ký thất bại!');
      }
    });
  }
}
