import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classroom-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './classroom-detail.component.html',
  styleUrl: './classroom-detail.component.scss'
})
export class ClassroomDetailComponent implements OnInit{

  classroom: any;
  classroomId!: number;
  loading = true;
  isCreator = false;

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.classroomId = Number(this.route.snapshot.paramMap.get('id'));
    this.classroomService.getClassDetail(this.classroomId).subscribe({
      next: (res) => {
        this.classroom = res.data;
        this.isCreator = res.data.isCreatedByCurrentUser; // backend nên gửi field này
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Không thể tải thông tin lớp học');
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/classroom']);
  }

  leaveOrDelete() {
    const action = this.isCreator ? this.classroomService.deleteClass(this.classroomId) : this.classroomService.leaveClass(this.classroomId);

    action.subscribe({
      next: () => {
        this.toastr.success(this.isCreator ? 'Đã xoá lớp học' : 'Đã rời lớp học');
        this.router.navigate(['/classroom']);
      },
      error: () => {
        this.toastr.error('Thao tác thất bại');
      }
    });
  }
}
