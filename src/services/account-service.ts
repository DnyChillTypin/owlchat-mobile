import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const AUTH_BASE_URL = `${API_ENDPOINTS.USER_SERVICE}/auth`;

import type {
  AuthenticateResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshRequest,
  RefreshResponse,
  RenewCodeResponse,
  SignUpAuthenticateRequest,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth.type";

export async function login(params: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    `${AUTH_BASE_URL}/login`,
    params,
  );
  return response.data;
}

export async function logout(params: LogoutRequest): Promise<void> {
  await apiClient.post(`${AUTH_BASE_URL}/logout`, params);
}

export async function refreshToken(
  params: RefreshRequest,
): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>(
    `${AUTH_BASE_URL}/refresh`,
    params,
  );
  return response.data;
}

export const authService = {
  // POST /auth/signup
  signup: async (payload: SignUpRequest): Promise<SignUpResponse> => {
    const res = await apiClient.post(`${AUTH_BASE_URL}/signup`, payload);
    return res.data;
  },

  // POST /auth/authenticate/{accountId}
  authenticate: async (
    accountId: string,
    payload: SignUpAuthenticateRequest,
  ): Promise<AuthenticateResponse> => {
    const res = await apiClient.post(
      `${AUTH_BASE_URL}/authenticate/${accountId}`,
      payload,
    );
    return res.data;
  },

  // GET /auth/authenticate/renew/{accountId}
  renewCode: async (accountId: string): Promise<RenewCodeResponse> => {
    const res = await apiClient.get(
      `${AUTH_BASE_URL}/authenticate/renew/${accountId}`,
    );
    return res.data;
  },
};
