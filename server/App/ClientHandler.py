from Network import ClientIO


class ClientHandler():
    def __init__(self, socket: ClientIO) -> None:
        self.socket = socket

        @self.socket.eventHandler
        def echo(msg):
            self.socket.send("print", msg)


    
        