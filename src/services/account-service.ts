import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
// import type { LoginRequest,
//     LoginResponse,
//     LogoutRequest,
//     RefreshRequest,
//     RefreshResponse
// } from "@/features/auth/types/auth.type";
import type {
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    RefreshRequest,
    RefreshResponse,
    SignUpRequest,
} from "@/types/auth.type";

export async function login(params: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
        `${API_ENDPOINTS.USER_SERVICE}/auth/login`,
        params,
    );
    return response.data;
}

export async function register(params: SignUpRequest): Promise<any> {
    const response = await apiClient.post(
        `${API_ENDPOINTS.USER_SERVICE}/auth/signup`,
        params,
    );
    return response.data;
}

export async function logout(params: LogoutRequest): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.USER_SERVICE}/auth/logout`, params);
}
export async function refreshToken(
    params: RefreshRequest,
): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>(
        `${API_ENDPOINTS.USER_SERVICE}/auth/refresh`,
        params,
    );
    return response.data;
}
