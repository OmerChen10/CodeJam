from database import DBManager
from executer import StorageManager
from constants import Account, Project
from network.sessions import SessionManager, Session
from utils import Logger
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
            if self.db_manager.get_user_by_email(props['username']) != None:
                return False
            
            user_id = self.db_manager.create_user(props['username'], props['email'], props['password'])
            self.account = Account(user_id, props['username'], props['email'])
            token = secrets.token_hex(16)
            self.db_manager.create_token(user_id, token, time.time())
            return {
                "token": token,
                "user": self._formatAccountToJson()
            }
        
        @self.socket.eventHandler
        def loginUser(props):
            ret = self.db_manager.get_user_by_email(props['email'])
            if ret is None: return False

            id, username, email, password = ret
            if password != props['password']: return False
            
            self.account = Account(id, username, props["email"])
            token = secrets.token_hex(16)
            self.db_manager.create_token(id, token, time.time())
            return {
                "token": token,
                "user": self._formatAccountToJson()
            }
        
        @self.socket.eventHandler
        def autoLogin(props: dict):
            user_id = self.db_manager.get_user_id_by_token(props['token'])
            if user_id is None: return False

            ret = self.db_manager.get_user_by_id(user_id)
            if ret is None: return False
            
            _, username, email, _ = ret
            self.account = Account(user_id, username, email)

            return {
                "user": self._formatAccountToJson()
            }
        
        @self.socket.eventHandler
        def updateUserData(props):
            current_password = self.db_manager.get_user_password(self.account.id)
            if current_password != props['currentPassword']: return False

            self.db_manager.update_user(self.account.id, props['username'], props['email'], props['password'])
            self.account = Account(self.account.id, props['username'], props['email'])
            return {
                "user": self._formatAccountToJson()
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
            try: 
                self.storage_manager.create_project(
                    id=project_id,
                    author=self.account.name,
                    name=props["name"],
                    description=props["description"]
                )
            except Exception as e:
                self.db_manager.delete_project(project_id)
                Logger.log_error(f"Error creating project: {e}")
                return False
                
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
            if not self.db_manager.project_exists(props["id"]): return False
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
        def joinSession(props):
            self.session = self.session_manager.get_session(self.project)
            self.session.join(self.socket)
            return True

        @self.socket.eventHandler
        def executerCommand(props):
            self.session.controller.send_input(props["command"])
            return True
        
        @self.socket.eventHandler
        def autoSave(props):
            self.storage_manager.save_file(self.project.id, props["name"], props["data"])
            return True
        
        @self.socket.eventHandler
        def getInvitationRequests(props):
            project_id_list = self.db_manager.get_invites_for_user(self.account.id)
            if project_id_list is None: return {"projects": []}
            return {
                "projects": [self.storage_manager.get_metadata(id) for id in project_id_list]
            }
        
        @self.socket.eventHandler
        def acceptInvite(props):
            self.db_manager.delete_invite(self.account.id, props["id"])
            self.db_manager.add_user_to_project(self.account.id, props["id"])
            return True
        
        @self.socket.eventHandler
        def declineInvite(props):
            self.db_manager.delete_invite(self.account.id, props["id"])
            return True
        
        @self.socket.eventHandler
        def getUsersForProject(props):
            id_list = self.db_manager.get_users_for_project(self.project.id)
            if id_list is None: return {"users": []}
            username_list = [self.db_manager.get_user_by_id(id)[1] for id in id_list if id != self.account.id]
            return username_list
        
        @self.socket.eventHandler
        def removeUserFromProject(props):
            user_id = self.db_manager.get_user_by_username(props["username"])[0]
            self.db_manager.remove_user_from_project(user_id, self.project.id)
            return True
        
        @self.socket.eventHandler
        def sendInvite(props):
            user = self.db_manager.get_user_by_username(props["username"])
            if user is None: return False
            self.db_manager.create_invite(user[0], self.project.id)

            self.network_manager.send_to_user(user[0], 
                                              "inviteRequest", 
                                              self.storage_manager.get_metadata(self.project.id))
            return True
        
    
    def _formatAccountToJson(self):
        return {
            "username": self.account.name,
            "email": self.account.email,
        }

    
        