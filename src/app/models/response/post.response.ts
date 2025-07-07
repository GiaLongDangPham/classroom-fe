import { PostCommentResponse } from "./post-comment.response";

export interface PostResponse{
  id?: number;
  title?: string;
  content?: string; 
  imageUrl?: string;
  avatarUrl?: string
  createdAt?: Date;
  createdBy?: string;  
  classroomId?: number;
  
  //Cho like/unlike
  likeCount?: number;
  liked?: boolean;

  // Bổ sung cho comment
  comments?: PostCommentResponse[];
  newComment?: string;
  showComments?: boolean;
  commentCount?: number;
}