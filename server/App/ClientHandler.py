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

        self.account: Account = None

        @self.socket.eventHandler
        def editorSend(msg):
            self.network_manager.broadcast(self.socket, "editorReceive", msg)

        @self.socket.eventHandler
        def createUser(props):
            if self.db_manager.get_user(props['username']) != []:
                return False
            
            self.db_manager.create_user(props['username'], props['password'])
            return True
        
        @self.socket.eventHandler
        def loginUser(props):
            id, _, password = self.db_manager.get_user(props['username'])[0]
            self.account = Account(id)
            return password == props['password']
        
        @self.socket.eventHandler
        def getProjectListForUser(username):
            return self.db_manager.get_projects_for_user(self.account.id)


class Account():
    """Represents a user account. This class is used to manage the user's projects and permissions."""
    
    def __init__(self, id: int) -> None:
        self.db_manager = DBManager.get_instance()
        self.id = id
        self.username = self.db_manager.execute(f"SELECT username FROM users WHERE id = {id}")[0][0]



    
        