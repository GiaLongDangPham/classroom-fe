import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClassroomService } from '../../../services/classroom.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../layout/header/header.component';
import { ApiResponse } from '../../../models/api.response';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './classroom-list.component.html',
  styleUrl: './classroom-list.component.scss'
})
export class ClassroomListComponent implements OnInit {
  classrooms: any[] = [];
  suggestedClasses: any[] = [];
  loading = true;
  joinCode = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private classroomService: ClassroomService,
  ) {}

  ngOnInit(): void {
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

  joinSuggestedClass(code: string): void {
    this.joinCode = code;
    this.onJoinClass();
  }
}
