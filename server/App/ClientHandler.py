import json
from Network import ClientIO
from App.database.manager import DBManager
from Logger import Logger

class ClientHandler():
    def __init__(self, manager, socket: ClientIO) -> None:
        from Network import NetworkManger
        self.network_manager: NetworkManger = manager
        self.socket = socket
        self.db_manager: DBManager = DBManager.get_instance()

        @self.socket.eventHandler
        def editorSend(msg):
            self.network_manager.broadcast(self.socket, "editorReceive", msg)

        @self.socket.eventHandler
        def createUser(props):
            self.db_manager.create_user(props['username'], props['password'])
            return True




    
        