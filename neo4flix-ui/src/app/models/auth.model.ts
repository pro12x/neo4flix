export interface User {
  id: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  email: string;
  role: string;
  enable: boolean;
  avatar?: string;
  lastConnection?: Date;
  createdAt: Date;
  updatedAt?: Date;
  twoFactorEnabled?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  pseudo: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}
