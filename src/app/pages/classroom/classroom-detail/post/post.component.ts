import { Component, Input } from '@angular/core';
import { PostResponse } from '../../../../models/response/post.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../../../pipes/time-ago.pipe';
import { PostInteractionService } from '../../../../services/post-interaction.service';
import { UserResponse } from '../../../../models/response/user.response';
import { PostCommentResponse } from '../../../../models/response/post-comment.response';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TimeAgoPipe,
    AvatarComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post: PostResponse = {}; 
  @Input() user: UserResponse = {}; 
  visibleComment: number = 2;
  defaultAvatar = '/assets/default-avatar.png';

  constructor(
    private postInteractionService: PostInteractionService,
  ) {}

  ngOnInit() {
    this.loadComments();
  }

  onLike() {
    const newIsLiked = !this.post.liked;

    this.postInteractionService.likeOrUnlikePost(this.post.id!, newIsLiked).subscribe({
      next: (res: PostResponse) => {
        this.post.liked = res.liked;
        this.post.likeCount = res.likeCount;
      },
      error: (error) => {
        console.error('Lỗi khi like/unlike bài viết:', error);
      }
    });
  }

  onShare(post: PostResponse) {
    console.log('Đã chia sẻ bài viết', post.id);
  }

  toggleComment() {
    this.post.showComments = !this.post.showComments;
  }

  submitComment() {
    const content = this.post.newComment?.trim();
    if (!content) return;

    this.postInteractionService.addComment(this.post.id!, content).subscribe({
      next: (res: PostCommentResponse) => {
        debugger
        this.loadComments(); // Reload lại danh sách comment
        this.post.newComment = '';
      },
      error: (err) => {
        debugger
        console.error('Lỗi khi gửi bình luận:', err);
      }
    });
  }

  loadComments() {
    this.postInteractionService.getComments(this.post.id!).subscribe({
      next: (comments: PostCommentResponse[]) => {
        this.post.comments = comments;
        this.post.commentCount = comments.length; // Cập nhật số lượng bình luận
      },
      error: (err) => console.error('Lỗi khi tải bình luận:', err)
    });
  }

  get visibleComments() {
    return this.post.comments?.slice(0, this.visibleComment) || [];
  }

  showMoreComments() {
    this.visibleComment += 5; // Mỗi lần xem thêm, hiển thị thêm 5 bình luận
  }

}
