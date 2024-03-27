from Network import ClientIO
from App.database.manager import DBManager
from App.StorageManager import StorageManager

class ClientHandler():
    def __init__(self, manager, socket: ClientIO) -> None:
        from Network import NetworkManger
        self.network_manager: NetworkManger = manager
        self.socket = socket
        self.db_manager: DBManager = DBManager.get_instance()

        self.account: Account = None
        self.project: Project = None
        self.storage_manager: StorageManager = StorageManager()

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
        def getProjectListForUser(props):
            id_list = self.db_manager.get_projects_for_user(self.account.id)
            if id_list is None: return True
            if type(id_list) == int: id_list = [id_list]
            return {"projects": [self.storage_manager.get_metadata(id) for id in id_list]}
            
        
        @self.socket.eventHandler
        def createProject(props):
            project_id = self.db_manager.create_project(self.account.id)
            self.storage_manager.create_project(
                id=project_id,
                author=self.account.name,
                name=props["name"],
                description=props["description"]
            )
            return True
        
        @self.socket.eventHandler
        def updateProjectMetadata(props):
            self.storage_manager.update_metadata(id=props["id"], 
                                                 name=props["name"], 
                                                 description=props["description"], 
                                                 author=self.account.name)
            return True
        
        @self.socket.eventHandler
        def deleteProject(props):
            self.db_manager.delete_project(props["id"])
            self.storage_manager.delete_project(props["id"])
            return True
        
        @self.socket.eventHandler
        def setCurrentProject(props):
            self.project = Project(props["id"], props["name"], props["author"], props["description"])
            return True
        
        @self.socket.eventHandler
        def getProjectFilePaths(props):
            return self.storage_manager.get_file_paths(self.project.id)
        
        @self.socket.eventHandler
        def createFile(props):
            return self.storage_manager.create_file(self.project.id, props["name"])



class Account():
    """Represents a user account. This class is used to manage the user's projects and permissions."""
    
    def __init__(self, id: int, name: str, email: str) -> None:
        self.id = id
        self.email = email
        self.name = name

    def __str__(self) -> str:
        return f"Account: ID: {self.id}, Name: {self.name}, Email: {self.email}"
    
class Project():
    def __init__(self, id: int, name: str, author: str, description: str) -> None:
        self.id = id
        self.name = name
        self.author = author
        self.description = description

    def __str__(self) -> str:
        return f"Project: ID: {self.id}, Name: {self.name}, Author: {self.author}, Description: {self.description}"



    
        