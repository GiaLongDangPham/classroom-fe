export interface PostResponse{
  id?: number;
  title?: string;
  content?: string; 
  imageUrl?: string;
  avatarUrl?: string
  createdAt?: Date;
  createdBy?: string;  
  classroomId?: number;
}