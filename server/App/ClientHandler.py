from Network import ClientIO
from Network import NetworkManger

class ClientHandler():
    def __init__(self, manager: NetworkManger, socket: ClientIO) -> None:
        self.manager = manager
        self.socket = socket

        @self.socket.eventHandler
        def echo(msg):
            self.socket.send("print", msg)


    
        