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
    email: string;
    password: string;
}
