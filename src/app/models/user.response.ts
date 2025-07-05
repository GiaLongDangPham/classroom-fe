export interface UserResponse {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
}

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}