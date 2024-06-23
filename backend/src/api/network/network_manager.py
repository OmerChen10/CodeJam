import ssl
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

        self.ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        self.ssl_context.load_cert_chain(NetworkConfig.CERT_PATH, NetworkConfig.KEY_PATH)

    def run(self):
        """ Starts listening for new connections. """

        Logger.log_info("[Network Handler] Starting network handler")

        # Create a new event loop
        asyncio.set_event_loop(asyncio.new_event_loop())
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self.start_server())  # Start the server
        self.loop.run_forever()

    async def start_server(self):
        if NetworkConfig.SSL_ENABLED:
            await websockets.serve(self.handle_connection, "0.0.0.0", NetworkConfig.COM_PORT, ssl=self.ssl_context)

        else:
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

    def send_to_user(self, user_id: int, event_name: str, data: str):
        """ Sends data to a specific client. """

        for user in self.handlers:
            if user.account != None:
                if user.account.id == user_id:
                    user.socket.send(event_name, data)
                    break
