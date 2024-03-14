from Network import ClientIO
from App.database.manager import DBManager
from App.Projects import Project


class ClientHandler():
    def __init__(self, manager, socket: ClientIO) -> None:
        from Network import NetworkManger
        self.network_manager: NetworkManger = manager
        self.socket = socket
        self.db_manager: DBManager = DBManager.get_instance()

        self.account: Account = None
        self.project: Project = None

        @self.socket.eventHandler
        def editorSend(msg):
            self.network_manager.broadcast(self.socket, "editorReceive", msg)

        @self.socket.eventHandler
        def createUser(props):
            if self.db_manager.get_user(props['username']) != None:
                return False
            
            self.db_manager.create_user(props['username'], props['email'], props['password'])
            return True
        
        @self.socket.eventHandler
        def loginUser(props):
            ret = self.db_manager.get_user(props['email'])
            if ret is None: return False

            id, username, email, password = ret
            if password != props['password']: return False
            
            self.account = Account(id, username, props["email"])
            return True
        
        @self.socket.eventHandler
        def getProjectListForUser(email):
            return self.db_manager.get_projects_for_user(self.account.id)
        
        @self.socket.eventHandler
        def createProject(props):
            project_id = self.db_manager.create_project(self.account.id)
            self.project = Project(id=project_id, 
                                   name=props['name'], 
                                   description=props['description'],
                                   author=self.account.name)
            
            return True



class Account():
    """Represents a user account. This class is used to manage the user's projects and permissions."""
    
    def __init__(self, id: int, name: str, email: str) -> None:
        self.id = id
        self.email = email
        self.name = name

    def __str__(self) -> str:
        return f"Account: ID: {self.id}, Name: {self.name}, Email: {self.email}"



    
        