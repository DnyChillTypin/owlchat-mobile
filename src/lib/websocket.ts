import { Client } from "@stomp/stompjs";
import { WS_ENDPOINTS } from "@/config/api";
import { secureStorage } from "@/lib/secure-storage";

class WebSocketClient {
    private client: Client;
    private isConnected: boolean = false;
    private wsUrl: string;
    private onStatusChange?: (isConnected: boolean) => void;

    constructor(wsUrl: string) {
        this.wsUrl = wsUrl;
        this.client = new Client({
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            // debug: (msg: string) => console.log(msg),
        });

        this.client.onWebSocketClose = (event) => {
            // Code 1000 = normal/clean close (e.g., user logged out). Don't warn for this.
            if (event.code !== 1000) {
                console.warn("WebSocket connection closed:", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                });
            } else {
                console.log("WebSocket disconnected cleanly (code 1000).");
            }
            if (this.isConnected) {
                this.isConnected = false;
                this.onStatusChange?.(false);
            }
        };
    }

    setStatusListener(callback: (isConnected: boolean) => void) {
        this.onStatusChange = callback;
    }

    async connect(onConnect: () => void, onError: (error: any) => void) {
        try {
            this.client.onConnect = () => {
                console.log("WebSocket connected successfully!");
                this.isConnected = true;
                this.onStatusChange?.(true);
                onConnect();
            };

            this.client.onStompError = (frame) => {
                console.error("STOMP error:", frame);
                this.isConnected = false;
                this.onStatusChange?.(false);
                onError(frame);
            };

            // This is critical: fetch a fresh token right before every (re)connect attempt
            this.client.beforeConnect = async () => {
                console.log("WebSocket: Preparing connection pulse...");
                const token = await secureStorage.getItem("accessToken");
                if (!token) {
                    console.error("WebSocket: No access token found during connection pulse.");
                    return;
                }
                // The API Gateway's JwtGatewayFilter expects the query param to also start with "Bearer "
                const bearerToken = `Bearer ${token}`;
                const wsUrlWithToken = `${this.wsUrl}?token=${encodeURIComponent(bearerToken)}`;
                console.log("WebSocket: Pulse refreshing brokerage URL (token length: " + token.length + ")");
                this.client.brokerURL = wsUrlWithToken;
            };

            this.client.activate();
        } catch (e) {
            console.error("WebSocket activation error:", e);
            this.isConnected = false;
            this.onStatusChange?.(false);
            onError(e);
        }
    }

    disconnect() {
        if (this.client.active) {
            this.client.deactivate();
            this.isConnected = false;
            this.onStatusChange?.(false);
        }
    }

    subscribe(destination: string, callback: (message: any) => void) {
        if (this.isConnected) {
            return this.client.subscribe(destination, (message) => {
                callback(JSON.parse(message.body));
            });
        } else {
            console.error("WebSocket is not connected (subscribe called).");
        }
    }

    send(destination: string, body: any) {
        if (this.isConnected) {
            this.client.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.error("WebSocket is not connected (send called).");
            throw new Error("WebSocket is not connected.");
        }
    }
}

export const chatWebSocketClient = new WebSocketClient(WS_ENDPOINTS.CHAT_WS);
export const socialWebSocketClient = new WebSocketClient(WS_ENDPOINTS.SOCIAL_WS);
