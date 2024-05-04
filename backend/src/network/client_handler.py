from database import DBManager
from executer import StorageManager
from constants import Account, Project
from network.sessions import SessionManager, Session
import secrets
import time 

class ClientHandler():
    def __init__(self, manager, socket) -> None:
        from network import NetworkManger
        from network import ClientIO

        self.network_manager: NetworkManger = manager
        self.socket: ClientIO = socket
        self.db_manager: DBManager = DBManager.get_instance()
        self.session_manager: SessionManager = SessionManager.get_instance()
        self.storage_manager: StorageManager = StorageManager()
        
        self.account: Account = None
        self.project: Project = None
        self.session: Session = None

        @self.socket.eventHandler
        def createUser(props):
            if self.db_manager.get_user(props['username']) != None:
                return False
            
            user_id = self.db_manager.create_user(props['username'], props['email'], props['password'])
            self.account = Account(user_id, props['username'], props['email'])
            token = secrets.token_hex(16)
            self.db_manager.create_token(user_id, token, time.time())
            return {
                "token": token,
                "user": self.formatAccountToJson()
            }
        
        @self.socket.eventHandler
        def loginUser(props):
            ret = self.db_manager.get_user(props['email'])
            if ret is None: return False

            id, username, email, password = ret
            if password != props['password']: return False
            
            self.account = Account(id, username, props["email"])
            token = secrets.token_hex(16)
            self.db_manager.create_token(id, token, time.time())
            return {
                "token": token,
                "user": self.formatAccountToJson()
            }
        
        @self.socket.eventHandler
        def autoLogin(props):
            user_id = self.db_manager.get_user_id_by_token(props['token'])
            if user_id is None: return False

            ret = self.db_manager.get_user_by_id(user_id)
            if ret is None: return False
            
            _, username, email, _ = ret
            self.account = Account(user_id, username, email)
            return {
                "user": self.formatAccountToJson()
            }
        
        @self.socket.eventHandler
        def updateUserData(props):
            current_password = self.db_manager.get_user_password(self.account.id)
            if current_password != props['currentPassword']: return False

            self.db_manager.update_user(self.account.id, props['username'], props['email'], props['password'])
            self.account = Account(self.account.id, props['username'], props['email'])
            return {
                "user": self.formatAccountToJson()
            }

        @self.socket.eventHandler
        def getProjectListForUser(props):
            id_list = self.db_manager.get_projects_for_user(self.account.id)
            if id_list is None: return {"projects": []}
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
            self.session = self.session_manager.get_session(self.project)
            self.session.join(self.socket)

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
        def fetchFile(props):
            return self.storage_manager.get_file(self.project.id, props["name"])

        @self.socket.eventHandler
        def deleteFile(props):
            return self.storage_manager.delete_file(self.project.id, props["name"])
        
        @self.socket.eventHandler
        def clientInHomePage(props):
            if self.session is not None:
                self.session.leave(self.socket)
                self.session = None
        

        @self.socket.eventHandler
        def executerCommand(props):
            self.session.controller.send_input(props["command"])
            return True
        
        @self.socket.eventHandler
        def autoSave(props):
            self.storage_manager.save_file(self.project.id, props["name"], props["data"])
            return True
        
    
    def formatAccountToJson(self):
        return {
            "username": self.account.name,
            "email": self.account.email,
        }

    
        