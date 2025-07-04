import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClassroomService } from '../../../services/classroom.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './classroom-list.component.html',
  styleUrl: './classroom-list.component.scss'
})
export class ClassroomListComponent implements OnInit {
  classrooms: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastr: ToastrService,
    private classroomService: ClassroomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.classroomService.getMyClasses().subscribe({
      next: (response: any) => {
        debugger
        this.classrooms = response.data;
        this.loading = false;
      },
      error: (err) => {
        debugger
        console.error('Lỗi lấy lớp học:', err);
        this.toastr.error('Không thể tải danh sách lớp học');
        this.loading = false;
      }
    });
  }

  goToClassroom(id: number) {
    this.router.navigate(['/classroom', id]);
  }

  logout() {
    this.authService.logout();
    // window.location.href = '/login'; // Redirect to login page
  }
}