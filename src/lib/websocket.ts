import { Client } from "@stomp/stompjs";
import { WS_ENDPOINTS } from "@/config/api";
import { secureStorage } from "@/lib/secure-storage";

class WebSocketClient {
    private client: Client;
    private isConnected: boolean = false;
    private wsUrl: string;

    constructor(wsUrl: string) {
        this.wsUrl = wsUrl;
        this.client = new Client({
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            // debug: (msg: string) => console.log(msg),
        });

        this.client.onWebSocketClose = (event) => {
            // console.warn("WebSocket connection closed:", event);
            this.isConnected = false;
        };
    }

    async connect(onConnect: () => void, onError: (error: any) => void) {
        try {
            const token = await secureStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found in SecureStore.");
                onError(new Error("No access token found."));
                return;
            }
            
            const wsUrlWithToken = `${this.wsUrl}?token=Bearer%20${encodeURIComponent(token)}`;
            console.log("Connecting to WebSocket URL:", wsUrlWithToken);
            
            this.client.brokerURL = wsUrlWithToken;
            
            this.client.onConnect = () => {
                console.log("WebSocket connected!");
                this.isConnected = true;
                onConnect();
            };
            this.client.onStompError = (frame) => {
                console.error("STOMP error:", frame);
                this.isConnected = false;
                onError(frame);
            };

            this.client.activate();
        } catch (e) {
            console.error("WebSocket connect error", e);
            onError(e);
        }
    }

    disconnect() {
        if (this.client.active) {
            this.client.deactivate();
            this.isConnected = false;
        }
    }

    subscribe(destination: string, callback: (message: any) => void) {
        if (this.isConnected) {
            return this.client.subscribe(destination, (message) => {
                callback(JSON.parse(message.body));
            });
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    send(destination: string, body: any) {
        if (this.isConnected) {
            this.client.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.error("WebSocket is not connected.");
        }
    }
}

export const chatWebSocketClient = new WebSocketClient(WS_ENDPOINTS.CHAT_WS);
