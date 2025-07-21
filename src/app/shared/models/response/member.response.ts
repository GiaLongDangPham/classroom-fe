export interface MemberResponse {
  id?: number;
  fullName?: string;
  email?: string;
  roleInClass?: string; // 'STUDENT' | 'TEACHER'
  avatarUrl?: string; // URL to the avatar image
}