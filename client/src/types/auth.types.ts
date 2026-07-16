/**
 * AUTOSURE — Authentication Types
 */

export type UserRole = 'customer' | 'officer' | 'admin';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
  role?: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface TokenPayload {
  uid: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
