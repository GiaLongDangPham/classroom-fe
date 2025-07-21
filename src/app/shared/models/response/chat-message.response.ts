import { UserResponse } from './user.response';

export interface ChatMessageResponse {
  id: number;
  classroomId: number;
  content: string;
  user: UserResponse;
  sentAt: Date;
}