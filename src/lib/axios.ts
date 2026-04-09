import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import { secureStorage } from "@/lib/secure-storage";
import { resetToAuth } from "@/navigation/navigationRef";

const baseURL = API_BASE_URL;
const apiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
    try {
        const urlPath = (config.url || "").toString();
        const isAuthEndpoint =
            /\/(user-service\/)?api\/auth\/(login|register|refresh)$/.test(
                urlPath,
            );


        const token = await secureStorage.getItem("accessToken");
        if (token && !isAuthEndpoint) {
            config.headers = config.headers || {};
            (config.headers as Record<string, string>)["Authorization"] =
                `Bearer ${token}`;
        }
    } catch {}
    return config;
});

// Response interceptor to handle 401 errors and JSON parsing errors
apiClient.interceptors.response.use(
    (response) => {
        try {
            if (response.data && typeof response.data === "string") {
                JSON.parse(response.data);
            }
        } catch (jsonError) {
            console.error("Invalid JSON response from server:", jsonError);
            return Promise.reject(
                new Error("Server returned invalid JSON response"),
            );
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log("Access token expired. Attempting to refresh token...");
                const refreshTokenValue = await secureStorage.getItem("refreshToken");
                if (!refreshTokenValue)
                    throw new Error("No refresh token found");
                
                // Break the require 
                // cycle by using axios directly without interceptors
                const response = await axios.post(`${API_ENDPOINTS.USER_SERVICE}/auth/refresh`, {
                    refreshToken: refreshTokenValue,
                });
                
                const data = response.data;
                await secureStorage.setItem("accessToken", data.accessToken);
                originalRequest.headers["Authorization"] =
                    `Bearer ${data.accessToken}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                await secureStorage.removeItem("accessToken");
                await secureStorage.removeItem("refreshToken");
                await secureStorage.removeItem("user");
                resetToAuth();
                return Promise.reject(refreshError);
            }
        }
        
        if (error.response?.status === 403) {
            error.message = "Bạn không có quyền thực hiện hành động này";
        } else if (error.response?.status === 404) {
            error.message = "Không tìm thấy tài nguyên yêu cầu";
        } else if (error.response?.status >= 500) {
            error.message = "Lỗi server. Vui lòng thử lại sau";
        } else if (error.message.includes("Network Error")) {
            console.error("====== AXIOS RAW ERROR ======");
            console.error("URL Attempted:", originalRequest.url);
            console.error("Full Error Object:", JSON.stringify(error, null, 2));
            console.error("Message:", error.message);
            console.error("===========================");
            // Keep the original error message temporarily so we can see the exact cause
            // error.message =
            //     "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng";
        } else if (error.message.includes("JSON")) {
            error.message = "Lỗi định dạng dữ liệu từ server";
        }

        return Promise.reject(error);
    },
);
export default apiClient;
