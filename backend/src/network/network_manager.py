import websockets
import asyncio
import threading

from utils import Logger
from network import ClientIO
from network import ClientHandler
from constants import NetworkConfig

class NetworkManger(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.daemon = False

        self.clients: list[ClientIO] = []
        self.handlers: list[ClientHandler] = []
        self.num_clients: int = 0

    def run(self):
        """ Starts listening for new connections. """

        Logger.log_info("[Network Handler] Starting network handler")

        # Create a new event loop
        asyncio.set_event_loop(asyncio.new_event_loop())
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self.start_server())  # Start the server
        self.loop.run_forever()

    async def start_server(self):
        await websockets.serve(self.handle_connection, "0.0.0.0", NetworkConfig.COM_PORT)

    async def handle_connection(self, websocket):
        """ Handles a new connection and create a new client handler for it. """

        Logger.log_info(f"[Network Handler] New connection from {websocket.remote_address}")
        self.num_clients += 1
        # Create a new client handler
        new_client = ClientIO(websocket, self.num_clients)
        # Add the client to the list of clients
        self.clients.append(new_client)
        self.handlers.append(ClientHandler(self, new_client))
        
        await asyncio.gather(new_client.start_receiving_loop(), 
                             new_client.start_sending_loop())

    def broadcast(self, curr_client: ClientIO, event_name: str, server_msg) -> None: 
        """ Sends a message to all clients. """

        for client in self.clients:
            if client is curr_client: continue
            client.send(event_name, server_msg)
