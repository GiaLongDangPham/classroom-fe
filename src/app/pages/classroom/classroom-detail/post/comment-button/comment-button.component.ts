import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../../../../shared/avatar/avatar.component';
import { PostInteractionService } from '../../../../../core/services/post-interaction.service';
import { PostCommentResponse } from '../../../../../shared/models/response/post-comment.response';
import { TimeAgoPipe } from '../../../../../core/pipes/time-ago.pipe';

@Component({
  selector: 'app-comment-button',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent,
    TimeAgoPipe
  ],
  templateUrl: './comment-button.component.html',
  styleUrl: './comment-button.component.scss'
})
export class CommentButtonComponent {

  @Input() postId!: number;
  @Input() userId!: number;
  @Input() isShowComments: boolean = false;
  @Input() commentCount: number = 0;

  visibleComment: number = 2;
  //Comment
  allComments: PostCommentResponse[] = [];
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
  }

  loadComments() {
    this.postInteractionService.getComments(this.postId!).subscribe({
      next: (comments: PostCommentResponse[]) => {
        this.allComments = comments;
      },
      error: (err) => console.error('Lỗi khi tải bình luận:', err)
    });
  }

  submitComment() {
    const content = this.newComment?.trim();
    if (!content) return;

    this.postInteractionService.addComment(this.postId!, content).subscribe({
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



  // Comment menu methods
  toggleCommentMenu(commentId: number) {
    this.openCommentMenuId = this.openCommentMenuId === commentId ? null : commentId;
  }

  closeCommentMenu() {
    this.openCommentMenuId = null;
  }

  isMyComment(comment: PostCommentResponse): boolean {
    return comment.userId === this.userId;
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
