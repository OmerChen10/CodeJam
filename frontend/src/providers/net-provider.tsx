import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnyResponse, GenericResponse, RouteConfig, NetConfig} from "../common";
import { LoadingScreen } from "../common/components";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import React from "react";

interface Event {
    eventName: string;
    data: object;
}

interface NetProviderInterface {
    send: <T extends AnyResponse>(eventName: string, message?: any) => Promise<T>;
    onEvent: <T extends AnyResponse>(event: string, callback: (data: T) => void) => void;
    connected: boolean;
    socket?: WebSocket;
}

export const NetworkContext = createContext<NetProviderInterface>(null!);

export function useNetwork() {
    return useContext(NetworkContext);
}

export function NetProvider({ children }: { children: React.ReactNode }) {
    const socket = useRef<WebSocket>();
    const eventHandlers = useRef(new Map<string, Function>());
    const [connected, setConnected] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("[NetworkManager] Connecting to server");
        console.log(`[NetworkManager] SSL Enabled: ${NetConfig.SSL_ENABLED}`)
        socket.current = new WebSocket(NetConfig.API_URL);

        socket.current.onopen = () => {
            console.log("[NetworkManager] Connected to server");
            setConnected(true);
        }

        socket.current.onmessage = (msg) => {
            const event: Event = JSON.parse(msg.data);
            const handler = eventHandlers.current.get(event.eventName); 
            if (handler) {
                handler(event);
            }  
        }

        setupBaseEventHandlers();
    }, []);

    function send<T extends AnyResponse>(eventName: string, message?: any): Promise<T> {
        // Send a message to the server and wait for a response
        return new Promise((resolve, reject) => {
            try {
                // Check if the massage is a json object
                if (message === undefined) {
                    message = {};
                } else if (typeof message === "object") {
                    // Convert the message to a string
                    
                    message = JSON.stringify(message);
                }
                
                socket.current?.send(JSON.stringify({eventName: eventName, data: message}));
                onEvent(eventName, (response: T) => {
                    resolve(response);
                });

            } catch (error) {
                console.log("[NetworkManager] Error sending message: ", error);
            }
        });
    }

    function onEvent<T extends AnyResponse>(event: string, callback: (data: T) => void) {
        // Add an event listener for a specific event
        eventHandlers.current.set(event, callback);
    }

    function setupBaseEventHandlers() {
        // Setup base event handlers 
        onEvent<GenericResponse<string>>("showInfoToast", (response) => {
            if (response.success) {
                toast.info(response.data);
            }
        });

        onEvent<GenericResponse<string>>("showWarningToast", (response) => {
            if (response.success) {
                toast.success(response.data);
            }
        });

        onEvent("goToHome", () => {
            toast.info("You have been removed from the project")
            navigate(RouteConfig.HOME);
        });
    }

    return (
        // Provide the network context to the children
        // Display a loading screen while the user is connecting to the server
        <NetworkContext.Provider value={{ send, onEvent, connected, socket: socket.current }}>
            { connected ? children : <LoadingScreen> Connecting to server </LoadingScreen>}
        </NetworkContext.Provider>
    );
}
