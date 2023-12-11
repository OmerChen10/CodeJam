
interface Event {
    eventName: string;
    data: string;
}

export class NetworkManager {
    public socket: WebSocket;
    private static instance: NetworkManager;
    private static eventHandlers: Map<string, (event: string) => void> = new Map();

    private constructor() {
        console.log("[NetworkManager] Connecting to server");
        this.socket = new WebSocket("ws://localhost:5800");

        this.socket.onopen = () => {
            console.log("[NetworkManager] Connected to server");
        }

        this.socket.onmessage = (msg) => {
            const event: Event = JSON.parse(msg.data);

            const handler = NetworkManager.eventHandlers.get(event.eventName);
            if (handler) {
                handler(event.data);
            } else {
                console.log("[NetworkManager] No handler for event: ", event.eventName);
            }
        }

        this.onEvent("print", (data) => {console.log(data)})
    }

    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }

        return NetworkManager.instance;
    }

    public send(eventName: string, message: any) {
        try {
            this.socket.send(JSON.stringify({"eventName": eventName, data: message}));
        } catch (error) {
            console.log("[NetworkManager] Error sending message: ", error);
        }
    }

    public onEvent(event: string, callback: (data: any) => void) {
        NetworkManager.eventHandlers.set(event, callback);
    }
}