import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LoadingScreen } from "../components";
import { AnyResponse} from "../../config";
import React from "react";

interface Event {
    eventName: string;
    data: object;
}

interface NetProviderInterface {
    send: <T extends AnyResponse>(eventName: string, message?: any) => Promise<T>;
    onEvent: <T extends AnyResponse>(event: string, callback: (data: T) => void) => void;
    connected: boolean;
}

export const NetworkContext = createContext<NetProviderInterface>(null!);

export function useNetwork() {
    return useContext(NetworkContext);
}

export function NetProvider({ children }: { children: React.ReactNode }) {
    const socket = useRef<WebSocket>();
    const eventHandlers = useRef(new Map<string, Function>());
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        console.log("[NetworkManager] Connecting to server");
        // get the ip address of the server
        let ip = window.location.hostname;
        socket.current = new WebSocket("ws://" + ip + ":5800");

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
    }, []);

    function send<T extends AnyResponse>(eventName: string, message?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                // Check if the massage is a json object
                if (message === undefined) {
                    message = {};
                } else if (typeof message === "object") {
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
        eventHandlers.current.set(event, callback);
    }

    return (
        <NetworkContext.Provider value={{ send, onEvent, connected }}>
            { connected ? children : <LoadingScreen> Connecting to server </LoadingScreen>}
        </NetworkContext.Provider>
    );
}
