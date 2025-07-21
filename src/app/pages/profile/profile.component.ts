import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse } from '../../shared/models/api.response';
import { UserResponse } from '../../shared/models/response/user.response';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user: UserResponse | null = null;

  loading = true;

  showEditForm = false;
  showChangePasswordForm = false;

  editData = {firstName: '', lastName: '', email: ''};

  editPasswordData = {oldPassword: '',newPassword: '', confirmPassword: ''};

  

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) this.showChangePasswordForm = false;
  }

  toggleChangePasswordForm() {
    this.showChangePasswordForm = !this.showChangePasswordForm;
    if (this.showChangePasswordForm) this.showEditForm = false;
  }

  loadProfile(): void {
    this.authService.getMyProfile().subscribe({
      next: (res: ApiResponse) => {
        this.user = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  updateProfile() {
    if (!this.user) {
      return;
    }
    this.userService.updateProfile(this.editData, this.user.id).subscribe({
      next: (response: ApiResponse) => {
        this.user = response.data;
        if(this.user == null || !this.user) {
          return;
        }
        
        this.userService.saveToLocalStorage(this.user);

        this.showEditForm = false;
        this.loadProfile();
        this.toast.success('Cập nhật thông tin thành công');
        this.editData = {
          firstName:  '',
          lastName:  '',
          email: ''
        };
        window.location.reload();
      },
      error: () => {
        this.toast.error('Cập nhật thông tin thất bại');
      }
    });
  }

  onChangePassword() {
    if (this.editPasswordData.newPassword !== this.editPasswordData.confirmPassword) {
      this.toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (!this.editPasswordData.oldPassword || !this.editPasswordData.newPassword || !this.editPasswordData.confirmPassword) {
      this.toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!this.user) {
      return;
    }
    
    this.userService.changePassword(this.editPasswordData, this.user.id ).subscribe({
      next: () => {
        debugger
        this.showChangePasswordForm = false;
        this.toast.success('Đổi mật khẩu thành công');
        this.editPasswordData = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error: any) => {
        debugger
        this.toast.error('Đổi mật khẩu thất bại');
      }
    });
  }

}
