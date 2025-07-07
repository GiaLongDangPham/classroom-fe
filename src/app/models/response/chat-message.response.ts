import { UserResponse } from './user.response';

export interface ChatMessageResponse {
  id: number;
  classroomId: number;
  content: string;
  user: UserResponse;
  sentAt: string; // ISO date string (có thể dùng pipe để hiển thị đẹp)
}