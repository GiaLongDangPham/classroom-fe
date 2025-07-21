export interface AuthRequest {
  username?: string;
  password?: string;
  firstName?: string; // chỉ dùng khi register
  lastName?: string;  // chỉ dùng khi register
  email?: string;     // chỉ dùng khi register
  role?: string;      // chỉ dùng khi register
}