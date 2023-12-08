from Network import ClientIO


class ClientHandler():
    def __init__(self, manager, socket: ClientIO) -> None:
        self.manager = manager
        self.socket = socket

        @self.socket.eventHandler
        def echo(msg):
            self.socket.send("print", msg)


    
        