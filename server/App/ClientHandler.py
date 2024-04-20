from Network import ClientIO
from App.database.manager import DBManager
from App.StorageManager import StorageManager
from App.Executer import Executer
from Constants import Account, Project
import time 
import secrets

class ClientHandler():
    def __init__(self, manager, socket: ClientIO) -> None:
        from Network import NetworkManger
        self.network_manager: NetworkManger = manager
        self.socket = socket
        self.db_manager: DBManager = DBManager.get_instance()

        self.account: Account = None
        self.project: Project = None
        self.storage_manager: StorageManager = StorageManager()
        self.executer: Executer = None

        @self.socket.eventHandler
        def editorSend(msg):
            self.network_manager.broadcast(self.socket, "editorReceive", msg)

        @self.socket.eventHandler
        def createUser(props):
            if self.db_manager.get_user(props['username']) != None:
                return False
            
            user_id = self.db_manager.create_user(props['username'], props['email'], props['password'])
            self.account = Account(user_id, props['username'], props['email'])
            token = secrets.token_hex(16)
            self.db_manager.create_token(user_id, token, time.time())
            return token
        
        @self.socket.eventHandler
        def loginUser(props):
            ret = self.db_manager.get_user(props['email'])
            if ret is None: return False

            id, username, email, password = ret
            if password != props['password']: return False
            
            self.account = Account(id, username, props["email"])
            token = secrets.token_hex(16)
            self.db_manager.create_token(id, token, time.time())
            return token
        
        @self.socket.eventHandler
        def autoLogin(props):
            ret = self.db_manager.get_user_by_token(props['token'])
            if ret is None: return False

            id, username, email = ret
            self.account = Account(id, username, email)
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
            return self.storage_manager.get_files(self.project.id)
        
        @self.socket.eventHandler
        def createFile(props):
            return self.storage_manager.create_file(self.project.id, props["name"])

        @self.socket.eventHandler
        def renameFile(props):
            return self.storage_manager.edit_file_name(self.project.id, props["oldName"], props["newName"])

        @self.socket.eventHandler
        def deleteFile(props):
            return self.storage_manager.delete_file(self.project.id, props["name"])
        
        @self.socket.eventHandler
        def clientInHomePage(props):
            self.project = None
            if self.executer is not None:
                self.executer.close()
                self.executer = None

            return True
        
        @self.socket.eventHandler
        def createExecuter(props):
            self.executer = Executer(self.project, self.socket)
        
        @self.socket.eventHandler
        def executerCommand(props):
            self.executer.send_input(props["command"])
            return True
        
        @self.socket.eventHandler
        def autoSave(props):
            self.storage_manager.save_file(self.project.id, props["name"], props["data"])
            return True

    
        