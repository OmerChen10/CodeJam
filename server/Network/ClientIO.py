import threading
import json
import asyncio
import websockets
from Logger import Logger
from App import ClientHandler

class ClientIO():
    """ Handles the client's messages. """

    def __init__(self, socket: websockets, id: int) -> None:
        self.socket = socket
        self.id = id

        self.recv_buffer = []
        self.send_buffer = []
        self.handler_map = {}

        self.received_new_message: threading.Event = threading.Event()
        self.message_sent: threading.Event = threading.Event()

        self.thread = threading.Thread(target=self.handle_requests)
        self.thread.daemon = True
        self.thread.start()

    
    def eventHandler(self, handler: callable):
        """ Decorator for adding an event handler. """

        self.handler_map[handler.__name__] = handler


    async def start_update_loop(self):
        """ Start the receiving and sending loops. """

        # Start the receiving and sending loops.
        await asyncio.gather(self.start_receiving_loop(), self.start_sending_loop())

    async def start_sending_loop(self):
        try:
            while True:
                for msg in self.recv_buffer:  # Send all pending messages.
                    await self.socket.send(msg)
                    # Remove the message from the list of pending messages.
                    self.recv_buffer.remove(msg)
                    self.message_sent.set()  # Set the message sent event.

                await asyncio.sleep(0.1)

        except Exception:
            Logger.log_info(f"[Client Handler] Client disconnected.")

    async def start_receiving_loop(self) -> dict:
        try:
            while True:
                client_update = await self.socket.recv() # Receive a message from the client.
                self.send_buffer.append(client_update) # Add the message to the list of received messages.

                self.received_new_message.set() # Set the received new message event.
                await asyncio.sleep(0.1)
        
        except Exception:
            Logger.log_info(f"[Client Handler] Client disconnected.")

    @Logger.catch_exceptions
    def receive(self):
        """ Returns the last received message. """

        self.received_new_message.wait() # Wait for a new message.
        self.received_new_message.clear()

        if len(self.send_buffer) == 0: return ""
        msg = self.send_buffer.pop(0)
        return msg

    def send(self, event_name: int, server_msg):
        """ Sends a message to the client. """

        # Create the message. (Using json to serialize the data).
        msg = json.dumps({"eventName": event_name, "data": server_msg}) 
        self.recv_buffer.append(msg) # Add the message to the list of pending messages.

        self.message_sent.wait() # Wait for the message to be sent.
        self.message_sent.clear()

    @Logger.catch_exceptions
    def handle_requests(self) -> None:
        """ Handles the client's requests. """

        while True:
            # Analyze the request.
            msg = self.receive()
            if msg == "": continue
            header, msg_data = json.loads(msg).values()
            if header not in self.handler_map.keys(): continue

            self.handler_map[header](msg_data)




    async def stop(self) -> None:
        """ Stops the client. """

        await self.socket.close()
        asyncio.get_event_loop().stop()
        self.thread.join()
