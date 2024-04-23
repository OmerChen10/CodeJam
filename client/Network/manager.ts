import { ServerResponseInterface } from "../Constants";


interface Event {
    eventName: string;
    data: any;
}

export class NetworkManager {
    public socket: WebSocket;
    private static instance: NetworkManager;
    private static eventHandlers: Map<string, (event: string) => void> = new Map();
    private static callbackQueue: [(() => void), number][] = [];

    private static eventPriority: { [eventName: string]: number } = {
        loginUser: 3,
        setCurrentProject: 2,
    };

    private constructor() {
        console.log("[NetworkManager] Connecting to server");
        // get the ip address of the server
        let ip = window.location.hostname;
        this.socket = new WebSocket("ws://" + ip + ":5800");

        this.socket.onopen = () => {
            console.log("[NetworkManager] Connected to server");
            // Sort the queue by priority
            NetworkManager.callbackQueue.sort((a, b) => b[1] - a[1]);
            NetworkManager.callbackQueue.forEach(([callback]) => callback());
        }

        this.socket.onmessage = (msg) => {
            const event: Event = JSON.parse(msg.data);

            const handler = NetworkManager.eventHandlers.get(event.eventName); 
            if (handler) {
                handler(event.data);
            }  
        }
    }

    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }

        return NetworkManager.instance;
    }

    public send(eventName: string, message: any,  callback?: (response: ServerResponseInterface) => void){
        try {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                NetworkManager.callbackQueue.push([
                    () => this.send(eventName, message, callback),
                    this.getPriority(eventName)
                ]);
                return;
            }
            // Check if the massage is a json object
            if (typeof message === "object") {
                message = JSON.stringify(message);
            }

            this.socket.send(JSON.stringify({eventName: eventName, data: message}));
            if (callback) {
                this.onEvent(eventName, callback);
            }
        } catch (error) {
            console.log("[NetworkManager] Error sending message: ", error);
        }
    }

    public onEvent(event: string, callback: (data: any) => void) {
        NetworkManager.eventHandlers.set(event, callback);
    }

    private getPriority(eventName: string): number {
        return NetworkManager.eventPriority[eventName] || 0;
    }
}