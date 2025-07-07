import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostComponent } from './post/post.component';
import { PostResponse } from '../../../models/response/post.response';
import { PostService } from '../../../services/post.service';
import { ApiResponse } from '../../../models/api.response';
import { ClassroomResponse } from '../../../models/response/classroom.response';
import { AvatarComponent } from "../../shared/avatar/avatar.component";
import { PostInteractionService } from '../../../services/post-interaction.service';
import { PostCommentResponse } from '../../../models/response/post-comment.response';
import { UserResponse } from '../../../models/response/user.response';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-classroom-detail',
  standalone: true,
  imports: [
    CommonModule,
    CreatePostComponent,
    PostComponent,
    AvatarComponent
],
  templateUrl: './classroom-detail.component.html',
  styleUrl: './classroom-detail.component.scss'
})
export class ClassroomDetailComponent implements OnInit{

  user: UserResponse = {};
  classroom: ClassroomResponse = {};
  classroomId!: number;
  loading = true;
  isCreator = false;
  posts: PostResponse[] = [];
  defaultAvatar = '/assets/default-avatar.png';
  visibleMembers:number = 2;
  isCreatingPost = false;

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private toastr: ToastrService,
    private router: Router,
    private postService: PostService,
    private postInteractionService: PostInteractionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalStorage() || {}; // Lấy user từ localStorage

    this.classroomId = Number(this.route.snapshot.paramMap.get('id'));
    this.classroomService.getClassDetail(this.classroomId).subscribe({
      next: (res: ApiResponse) => {
        debugger
        this.classroom = res.data;
        this.isCreator = `${this.user.firstName} ${this.user.lastName}` == res.data.createdBy;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Không thể tải thông tin lớp học');
        this.loading = false;
      }
    });

    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPostsByClassId(this.classroomId).subscribe({
      next: (res: ApiResponse) => {
        this.posts = res.data;
      },
      error: () => {
        debugger
        this.toastr.error('Không thể tải bài viết');
      }
    });
  }

  postCreated() {
    this.isCreatingPost = false;
    this.loadPosts();
  }
  
  goBack() {
    this.router.navigate(['/classroom']);
  }

  showMoreMembers() {
    this.visibleMembers += 2;
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

  toggleCreatePost() {
    this.isCreatingPost = !this.isCreatingPost;
  }

  onCancelClick(){
    this.isCreatingPost = false;

  }
}
