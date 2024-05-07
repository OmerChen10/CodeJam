import json
import asyncio
import websockets
from utils import Logger


class ClientIO():
    """ Handles the client's messages. """

    def __init__(self, socket: websockets, id: int) -> None:
        self.socket = socket
        self.id = id

        self.send_buffer = []
        self.handler_map = {}

        self.on_disconnect = None
    
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

        except Exception:
            Logger.log_info(f"[Client Handler] Client disconnected.")

    async def start_receiving_loop(self) -> dict:
        try:
            while True:
                msg = await self.socket.recv() # Receive a message from the client.

                # Analyze the request.
                if msg == "": continue
                event_name, msg_data = json.loads(msg).values()
                if event_name not in self.handler_map.keys(): continue

                # Check if the mag_data is a json string.
                try: msg_data = json.loads(msg_data)
                except: pass

                try:
                    ret = self.handler_map[event_name](msg_data)
                
                except Exception as e:
                    Logger.log_error(f"[Client Handler] An error occurred in event: {event_name}", e)
                    ret = self.send(event_name, False)
                    continue

                if ret is not None: self.send(event_name, ret)

                await asyncio.sleep(0.1)
        
        except websockets.exceptions.ConnectionClosed:
            Logger.log_info(f"[Client Handler] Client disconnected.")
            if self.on_disconnect is not None: self.on_disconnect()

        except Exception as e:
            Logger.log_error(f"[Client Handler] An error occurred in clientIO: {e}")


    @Logger.catch_exceptions
    def send(self, event_name: int, response=None):
        """ Sends a message to the client. """ 

        resp = {
            "eventName": event_name,
            "success": True,
        }

        if response is not None:
            if type(response) == bool:
                resp["success"] = response

            elif type(response) == dict:
                resp["data"] = response

            else:
                resp["data"] = response
        
        # Create the message. (Using json to serialize the data).
        msg = json.dumps(resp)
        self.send_buffer.append(msg) # Add the message to the list of pending messages.

    @Logger.catch_exceptions
    def setDisconnectHandler(self, handler: callable):
        """ Sets the disconnect handler. """

        self.on_disconnect = handler

    async def stop(self) -> None:
        """ Stops the client. """

        await self.socket.close()
        asyncio.get_event_loop().stop()
