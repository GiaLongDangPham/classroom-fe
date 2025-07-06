export interface UserResponse {
  id?: Number
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: Date;
  avatarUrl?: string;
  role?: Role;
}

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}