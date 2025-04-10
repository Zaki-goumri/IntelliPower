export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
export type RegisterResponse = {
  user: User;
  refreshToken: string;
  accessToken: string;
};

export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  SUPERUSER = "SUPERUSER",
}

export interface RegisterRequest {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}
