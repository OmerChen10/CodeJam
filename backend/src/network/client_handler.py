from network.sessions import SessionManager, Session
from constants import Account, Project
from executer import StorageManager
from shareDB import ShareDBManager
from database import DBManager
from utils import HashUtils, AesUtils
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
        self.shareDB_manager: ShareDBManager = ShareDBManager.get_instance()
        self.aes = AesUtils()
        
        self.account: Account = None
        self.project: Project = None
        self.session: Session = None

        @self.socket.event_handler
        def createUser(props):
            if self.db_manager.get_user_by_email(props['email']) != None:
                return False
            
            if self.db_manager.get_user_by_username(props['username']) != None:
                return False
            
            salt = HashUtils.generate_salt()
            hashed_password = HashUtils.hash_password(props['password'], salt)
            user_id = self.db_manager.create_user(props['username'], props['email'], hashed_password, salt)
            self.account = Account(user_id, props['username'], props['email'])

            token = secrets.token_hex(16)
            self.db_manager.create_token(user_id, token, time.time())
            return {
                "token": self.aes.encrypt(token + " " + self.socket.socket.remote_address[0]),
                "user": self._formatAccountToJson()
            }
        
        @self.socket.event_handler
        def loginUser(props):
            ret = self.db_manager.get_user_by_email(props['email'])
            if ret is None: return False

            id, username, email, password = ret
            salt = self.db_manager.get_user_salt(id)
            if password != HashUtils.hash_password(props['password'], salt):
                return False
            
            self.account = Account(id, username, props["email"])
            token = secrets.token_hex(16)
            self.db_manager.create_token(id, token, time.time())
            return {
                "token": self.aes.encrypt(token + " " + self.socket.socket.remote_address[0]),
                "user": self._formatAccountToJson()
            }
        
        @self.socket.event_handler
        def autoLogin(props: dict):
            token, signed_ip = self.aes.decrypt(props["token"]).split(" ")
            if (self.socket.socket.remote_address[0] != signed_ip): return False

            user_id = self.db_manager.get_user_id_by_token(token)
            if user_id is None: return False

            ret = self.db_manager.get_user_by_id(user_id)
            if ret is None: return False
            
            _, username, email, _ = ret
            self.account = Account(user_id, username, email)

            return {
                "user": self._formatAccountToJson()
            }
        
        @self.socket.event_handler
        def updateUserCredentials(props):
            self.db_manager.update_user_credentials(self.account.id, props["username"], props["email"])
            self.account = Account(self.account.id, props["username"], props["email"])
            return True
        
        @self.socket.event_handler
        def updateUserPassword(props):
            salt = self.db_manager.get_user_salt(self.account.id)
            if self.db_manager.get_user_password(self.account.id) != HashUtils.hash_password(props["oldPassword"], salt):
                return False
            
            self.db_manager.update_user_password(self.account.id, HashUtils.hash_password(props["newPassword"], salt))
            return True

        @self.socket.event_handler
        def getProjectListForUser(props):
            id_list = self.db_manager.get_projects_for_user(self.account.id)
            if id_list is None: return {"projects": []}
            if type(id_list) == int: id_list = [id_list]
            project_list = [self.storage_manager.get_metadata(id) for id in id_list]
            for project in project_list:
                project["isAdmin"] = self.db_manager.is_user_admin(self.account.id, project["id"])

            return {
                "projects": project_list
            }
            
        
        @self.socket.event_handler
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
        
        @self.socket.event_handler
        def updateProjectMetadata(props):
            self.storage_manager.update_metadata(id=props["id"], 
                                                 name=props["name"], 
                                                 description=props["description"], 
                                                 author=self.account.name)
            
            return True
        
        @self.socket.event_handler
        def deleteProject(props):
            if self.db_manager.is_user_admin(self.account.id, props["id"]):
                self.db_manager.delete_project(props["id"])
                self.storage_manager.delete_project(props["id"])
                self.shareDB_manager.delete_project(props["id"])

            else:
                self.db_manager.delete_project_for_user(self.account.id, props["id"])

            return True
        
        @self.socket.event_handler
        def setCurrentProject(project_id):
            if not self.db_manager.check_user_permission(self.account.id, project_id): return False
            is_admin = self.db_manager.is_user_admin(self.account.id, project_id)
            self.project = self._metadataToProject(self.storage_manager.get_metadata(project_id), is_admin)
            
            project_json = self._formatProjectToJson()
            project_json["isAdmin"] = is_admin
            return {
                "project": project_json,
                "projectToken": self.aes.encrypt(str(project_id))
            }
        
        @self.socket.event_handler
        def setCurrentProjectToken(token):
            project_id = self.aes.decrypt(token)
            if not self.db_manager.check_user_permission(self.account.id, project_id): return False
            admin = self.db_manager.is_user_admin(self.account.id, project_id)
            self.project = self._metadataToProject(self.storage_manager.get_metadata(project_id), admin)
            
            return {"project": self._formatProjectToJson()}
        
        @self.socket.event_handler
        def getProjectFilePaths(props):
            return self.storage_manager.get_files(self.project.id)
        
        @self.socket.event_handler
        def createFile(props):
            return self.storage_manager.create_file(self.project.id, props["name"])

        @self.socket.event_handler
        def renameFile(props):
            self.shareDB_manager.rename_file(self.project.id, props["oldName"], props["newName"])
            return self.storage_manager.edit_file_name(self.project.id, props["oldName"], props["newName"])
        
        @self.socket.event_handler
        def fetchFile(props):
            return self.storage_manager.get_file(self.project.id, props["name"])

        @self.socket.event_handler
        def deleteFile(props):
            self.shareDB_manager.delete_file(self.project.id, props["name"])
            return self.storage_manager.delete_file(self.project.id, props["name"])
        
        @self.socket.event_handler
        def clientInHomePage(props):
            if self.session is not None:
                self.session.leave(self)
                self.session = None

        @self.socket.event_handler
        def joinSession(props):
            self.session = self.session_manager.get_session(self.project)
            self.session.join(self)
            return True

        @self.socket.event_handler
        def executerCommand(props):
            self.session.controller.send_input(props["command"])
            return True
        
        @self.socket.event_handler
        def saveFile(props):
            self.storage_manager.save_file(self.project.id, props["name"], 
                                           self.shareDB_manager.read_file(self.project.id, props["name"]))
            return True
        
        @self.socket.event_handler
        def getInvitationRequests(props):
            project_id_list = self.db_manager.get_invites_for_user(self.account.id)
            if project_id_list is None: return {"projects": []}
            return {
                "projects": [self.storage_manager.get_metadata(id) for id in project_id_list]
            }
        
        @self.socket.event_handler
        def acceptInvite(props):
            # Check if the user is already in the project
            if self.db_manager.check_user_permission(self.account.id, props["id"]): return False
            self.db_manager.delete_invite(self.account.id, props["id"])
            self.db_manager.add_user_to_project(self.account.id, props["id"])
            return True
        
        @self.socket.event_handler
        def declineInvite(props):
            self.db_manager.delete_invite(self.account.id, props["id"])
            return True
        
        @self.socket.event_handler
        def getUsersForProject(props):
            id_list = self.db_manager.get_users_for_project(self.project.id)
            if id_list is None: return {"users": []}
            username_list = [self.db_manager.get_user_by_id(id)[1] for id in id_list if id != self.account.id]
            return username_list
        
        @self.socket.event_handler
        def removeUserFromProject(props):
            user_id = self.db_manager.get_user_by_username(props["username"])[0]
            self.db_manager.remove_user_from_project(user_id, self.project.id)
            for user in self.session.get_users():
                if user.account.id == user_id:
                    user.socket.send("goToHome")
            return True
        
        @self.socket.event_handler
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
    
    def _formatProjectToJson(self):
        return {
            "id": self.project.id,
            "name": self.project.name,
            "author": self.project.author,
            "description": self.project.description,
                }

    def _metadataToProject(self, metadata, admin=False):
        return Project(metadata["id"], metadata["name"], metadata["author"], metadata["description"], admin)
    
        