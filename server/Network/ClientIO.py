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

        self.send_buffer = []
        self.handler_map = {}
    
    def eventHandler(self, handler: callable):
        """ Decorator for adding an event handler. """

        self.handler_map[handler.__name__] = handler

    async def start_sending_loop(self):
        try:
            while True:
                for msg in self.send_buffer:  # Send all pending messages.
                    await self.socket.send(msg)
                    # Remove the message from the list of pending messages.
                    self.send_buffer.remove(msg)

                await asyncio.sleep(0.1)

        except websockets.exceptions.ConnectionClosedError:
            Logger.log_info(f"[Client Handler] Client disconnected.")

        except Exception as e:
            Logger.log_info(f"[Client Handler] An error occurred: {e}")

    async def start_receiving_loop(self) -> dict:
        try:
            while True:
                msg = await self.socket.recv() # Receive a message from the client.

                # Analyze the request.
                if msg == "": continue
                header, msg_data = json.loads(msg).values()
                if header not in self.handler_map.keys(): continue

                self.handler_map[header](msg_data)

                await asyncio.sleep(0.1)
        
        except websockets.ConnectionClosedError:
            Logger.log_error(f"[Client Handler] Client disconnected.")

        except Exception as e:
            Logger.log_error(f"[Client Handler] An error occurred: {e}")


    @Logger.catch_exceptions
    def send(self, event_name: int, server_msg):
        """ Sends a message to the client. """

        # Create the message. (Using json to serialize the data).
        msg = json.dumps({"eventName": event_name, "data": server_msg}) 
        self.send_buffer.append(msg) # Add the message to the list of pending messages.


    async def stop(self) -> None:
        """ Stops the client. """

        await self.socket.close()
        asyncio.get_event_loop().stop()
