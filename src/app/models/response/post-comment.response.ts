export interface PostCommentResponse{
  id?: number;
  postId?: number;
  userId?: number; // ID người dùng tạo bình luận
  content?: string;
  createdAt?: Date;
  createdBy?: string; // Tên người tạo bình luận
}