import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/classroom/my').subscribe({
      next: data => {
        this.classrooms = data;
        this.loading = false;
      },
      error: err => {
        // console.error('Lỗi lấy lớp học:', err);
        this.toastr.error('Không thể tải danh sách lớp học');
        this.loading = false;
      }
    });
  }

  goToClassroom(id: number) {
    this.router.navigate(['/classroom', id]);
  }
}