import { Component, Input } from '@angular/core';
import { PostResponse } from '../../../../shared/models/response/post.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { PostInteractionService } from '../../../../core/services/post-interaction.service';
import { UserResponse } from '../../../../shared/models/response/user.response';
import { PostCommentResponse } from '../../../../shared/models/response/post-comment.response';
import { PostLikeResponse } from '../../../../shared/models/response/post-like.response';
import { CommentButtonComponent } from "./comment-button/comment-button.component";
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TimeAgoPipe,
    CommentButtonComponent
],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post: PostResponse = {}; 
  @Input() user: UserResponse = {}; 
  defaultAvatar = '/assets/default-avatar.png';

  //Like
  isLiked: boolean = false;
  likeCount: number = 0;

  //Comment
  commentCount: number = 0;
  isShowComments: boolean = false;

  constructor(
    private postInteractionService: PostInteractionService,
  ) {}

  ngOnInit() {
    this.getIsLiked();
    this.countLikes();
    this.countComments();
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

  onShare(post: PostResponse) {
    console.log('Đã chia sẻ bài viết', post.id);
  }
}
