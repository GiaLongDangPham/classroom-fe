import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClassroomService } from '../../../core/services/classroom.service';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../shared/models/api.response';
import { AuthService } from '../../../core/services/auth.service';
import { UserResponse } from '../../../shared/models/response/user.response';
import { ClassroomRequest } from '../../../shared/models/request/classroom.model';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
],
  templateUrl: './classroom-list.component.html',
  styleUrl: './classroom-list.component.scss'
})
export class ClassroomListComponent implements OnInit {
  classrooms: any[] = [];
  suggestedClasses: any[] = [];
  loading = true;
  joinCode = '';
  currentUser: UserResponse = {};
  createdClass: ClassroomRequest = {
    name: '',
    description: ''
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private classroomService: ClassroomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userResponseJSON = localStorage.getItem('user'); 
    const userResponse = JSON.parse(userResponseJSON!);  
    this.currentUser = userResponse || {}; // Trả về đối tượng rỗng nếu không có dữ liệu
    this.fetchMyClasses();

  }

  fetchMyClasses() {
    this.classroomService.getMyClasses().subscribe({
      next: (response: ApiResponse) => {
        this.classrooms = response.data;
        this.loading = false;

        // Lấy tất cả lớp học => loại trừ những lớp đã tham gia
        this.classroomService.getExploreClasses().subscribe((res: ApiResponse) => {
          const joinedIds = new Set(this.classrooms.map(c => c.id));
          this.suggestedClasses = res.data.filter((c: any) => !joinedIds.has(c.id));
        });
      },
      error: () => {
        this.toastr.error('Không thể tải danh sách lớp học');
        this.loading = false;
      }
    });

    
  }

  goToClassroom(id: number) {
    this.router.navigate(['/classroom', id]);
  }

  onJoinClass(): void {
    if (!this.joinCode) {
      this.toastr.warning('Vui lòng nhập mã lớp');
      return;
    }

    this.classroomService.joinClass(this.joinCode).subscribe({
      next: () => {
        this.toastr.success('Tham gia lớp thành công!');
        this.fetchMyClasses();
        this.joinCode = '';
      },
      error: () => {
        this.toastr.error('Mã lớp không hợp lệ hoặc đã tham gia lớp này');
      }
    });
  }

  onCreateClass(): void {
    debugger
    if(this.currentUser.role !== 'TEACHER') {
      this.toastr.error('Chỉ giáo viên mới có thể tạo lớp học');
      return;
    }
    this.classroomService.createClass(this.createdClass).subscribe({
      next: (response: ApiResponse) => {
        this.toastr.success('Tạo lớp học thành công!');
        this.fetchMyClasses();
        this.createdClass = { name: '', description: '' }; // Reset form
      },
      error: (error) => {
        this.toastr.error('Không thể tạo lớp học: ' + (error.error?.message || 'Lỗi không xác định'));
      }
    });
  }

  joinSuggestedClass(code: string): void {
    this.joinCode = code;
    this.onJoinClass();
  }

  logout() {
    this.authService.logout();
  }
}
