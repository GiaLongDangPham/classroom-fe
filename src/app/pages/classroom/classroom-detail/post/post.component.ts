import { Component, Input } from '@angular/core';
import { PostResponse } from '../../../../shared/models/response/post.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { PostInteractionService } from '../../../../core/services/post-interaction.service';
import { UserResponse } from '../../../../shared/models/response/user.response';
import { PostCommentResponse } from '../../../../shared/models/response/post-comment.response';
import { AvatarComponent } from '../../../../shared/avatar/avatar.component';
import { get } from 'http';
import { PostLikeResponse } from '../../../../shared/models/response/post-like.response';
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

  //Like
  isLiked: boolean = false;
  likeCount: number = 0;

  //Comment
  allComments: PostCommentResponse[] = [];
  commentCount: number = 0;
  isShowComments: boolean = false;
  newComment: string = '';
  
  // Comment menu states
  openCommentMenuId: number | null = null;
  editingCommentId: number | null = null;
  editingCommentText: string = '';


  constructor(
    private postInteractionService: PostInteractionService,
  ) {}

  ngOnInit() {
    this.loadComments();
    this.getIsLiked();
    this.countLikes();
    this.countComments();
  }
  
  loadComments() {
    this.postInteractionService.getComments(this.post.id!).subscribe({
      next: (comments: PostCommentResponse[]) => {
        this.allComments = comments;
      },
      error: (err) => console.error('Lỗi khi tải bình luận:', err)
    });
  }

  getIsLiked() {
    this.postInteractionService.getIsLiked(this.post.id!, this.user.id!).subscribe({
      next: (isLiked: boolean) => {
        this.isLiked = isLiked;
      },
      error: (err) => console.error('Lỗi khi kiểm tra trạng thái like:', err)
    });
  }

  countLikes(){
    this.postInteractionService.countLikes(this.post.id!).subscribe({
      next: (count: number) => {
        this.likeCount = count;
      },
      error: (err) => console.error('Lỗi khi đếm số lượng like:', err)
    });
  }

  onLike() {
    this.postInteractionService.likeOrUnlikePost(this.post.id!).subscribe({
      next: (like: PostLikeResponse) => {
        if(like.postId && like.userId) this.isLiked = true;
        else this.isLiked = false;
        this.likeCount += this.isLiked ? 1 : -1;
      },
      error: (error) => {
        console.error('Lỗi khi like/unlike bài viết:', error);
      }
    });
  }

  countComments(){
    this.postInteractionService.countComments(this.post.id!).subscribe({
      next: (count: number) => {
        this.commentCount = count;
      },
      error: (err) => console.error('Lỗi khi đếm số lượng bình luận:', err)
    });
  }

  toggleComment() {
    this.isShowComments = !this.isShowComments;
  }

  submitComment() {
    const content = this.newComment?.trim();
    if (!content) return;

    this.postInteractionService.addComment(this.post.id!, content).subscribe({
      next: (res) => {
        debugger
        this.loadComments(); // Reload lại danh sách comment
        this.commentCount++;
        this.newComment = '';
      },
      error: (err) => {
        debugger
        console.error('Lỗi khi gửi bình luận:', err);
      }
    });
  }

  get visibleComments() {
    return this.allComments?.slice(0, this.visibleComment) || [];
  }

  showMoreComments() {
    this.visibleComment += 5; // Mỗi lần xem thêm, hiển thị thêm 5 bình luận
  }

  onShare(post: PostResponse) {
    console.log('Đã chia sẻ bài viết', post.id);
  }

  // Comment menu methods
  toggleCommentMenu(commentId: number) {
    this.openCommentMenuId = this.openCommentMenuId === commentId ? null : commentId;
  }

  closeCommentMenu() {
    this.openCommentMenuId = null;
  }

  isMyComment(comment: PostCommentResponse): boolean {
    return comment.userId === this.user.id;
  }

  startEditComment(comment: PostCommentResponse) {
    this.editingCommentId = comment.id!;
    this.editingCommentText = comment.content || '';
    this.closeCommentMenu();
    
    // Focus on input after view updates
    setTimeout(() => {
      const input = document.querySelector('.edit-comment-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  cancelEditComment() {
    this.editingCommentId = null;
    this.editingCommentText = '';
  }

  saveEditComment(commentId: number) {
    const content = this.editingCommentText.trim();
    if (!content) return;

    this.postInteractionService.updateComment(commentId, content).subscribe({
      next: () => {
        this.loadComments(); // Reload comments
        this.editingCommentId = null;
        this.editingCommentText = '';
      },
      error: (err: any) => {
        console.error('Lỗi khi cập nhật bình luận:', err);
      }
    });
  }

  deleteComment(commentId: number) {
    this.postInteractionService.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments(); // Reload comments
        this.commentCount--;
        this.closeCommentMenu();
      },
      error: (err: any) => {
        console.error('Lỗi khi xóa bình luận:', err);
      }
    });
  }

}
