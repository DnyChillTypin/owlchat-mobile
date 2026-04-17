import type { AccountRole } from "./enum/account-role";

export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    role: AccountRole;
    status: boolean;
}

export interface RefreshRequest {
    refreshToken: string;
}
export interface RefreshResponse {
    accessToken: string;
}
export interface LogoutRequest {
    refreshToken: string;
}
export interface LogoutResponse {
    message: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

export interface SignUpResponse {
  // backend returns generic object → keep flexible
  id?: string;
  [key: string]: any;
}

export interface SignUpAuthenticateRequest {
  code: string;
}

export interface AuthenticateResponse {
  [key: string]: any;
}

export type RenewCodeResponse = string;
