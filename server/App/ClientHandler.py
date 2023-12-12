from Network import ClientIO


class ClientHandler():
    def __init__(self, manager, socket: ClientIO) -> None:
        from Network import NetworkManger
        self.manager: NetworkManger = manager
        self.socket = socket

        @self.socket.eventHandler
        def editorSend(msg):
            self.manager.broadcast(self.socket, "editorReceive", msg)


    
        