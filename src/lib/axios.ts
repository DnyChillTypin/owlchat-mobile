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

// Mutex to prevent multiple simultaneous token refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

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

    // ── DEBUG: log every outgoing request ──────────────────────────────────
    const url = config.url || "";
    const fullUrl = url.startsWith("http") ? url : `${config.baseURL || ""}${url}`;
    const params = config.params ? JSON.stringify(config.params) : "(none)";
    console.log(`[API ▶] ${config.method?.toUpperCase()} ${fullUrl}  params=${params}`);
    // ───────────────────────────────────────────────────────────────────────

    return config;
});

// Response interceptor to handle 401 errors and JSON parsing errors
apiClient.interceptors.response.use(
    (response) => {


        // Axios already parses JSON automatically.
        // Only attempt manual parse if data is a raw string that starts with
        // a JSON delimiter — this avoids false errors on plain-text responses
        // (e.g. DELETE returning "OK" or empty body).
        if (typeof response.data === "string" && response.data.trim().length > 0) {
            const first = response.data.trim()[0];
            if (first === '{' || first === '[') {
                try {
                    response.data = JSON.parse(response.data);
                } catch (jsonError) {
                    console.error("Invalid JSON response from server:", jsonError);
                    return Promise.reject(
                        new Error("Server returned invalid JSON response"),
                    );
                }
            }
        }
        // ── DEBUG: log every response ───────────────────────────────────────
        const url = response.config?.url || "";
        if (url.includes("friendship") || url.includes("friend-request") || url.includes("chat")) {
            console.log(`[API ◀] ${response.status} ${url}  data=`, JSON.stringify(response.data)?.substring(0, 300));
        }
        // ───────────────────────────────────────────────────────────────────
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // ── DEBUG: log every error response ────────────────────────────────
        console.log(
            `[API ✖] ${error.response?.status} ${originalRequest?.url}  body="${JSON.stringify(error.response?.data)?.substring(0, 300)}"`
        );
        // ───────────────────────────────────────────────────────────────────

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Queue this request until the token is refreshed
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken: string) => {
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            isRefreshing = true;
            try {
                console.log("Access token expired. Attempting to refresh token...");
                const refreshTokenValue = await secureStorage.getItem("refreshToken");
                if (!refreshTokenValue)
                    throw new Error("No refresh token found");
                
                const response = await axios.post(`${API_ENDPOINTS.USER_SERVICE}/auth/refresh`, {
                    refreshToken: refreshTokenValue,
                });
                
                const data = response.data;
                const newToken = data.accessToken;
                await secureStorage.setItem("accessToken", newToken);
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                onRefreshed(newToken);

                return apiClient(originalRequest);
            } catch (refreshError) {
                refreshSubscribers = [];
                await secureStorage.removeItem("accessToken");
                await secureStorage.removeItem("refreshToken");
                await secureStorage.removeItem("user");
                resetToAuth();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
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
