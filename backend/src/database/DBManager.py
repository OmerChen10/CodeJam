from constants import DatabaseConfig
from utils import Logger
import sqlite3
import os

class DBManager:
    INSTANCE = None

    def __init__(self) -> None:
        if not os.path.exists(DatabaseConfig.PATH):
            Logger.log_info("Database file not found, creating new file.")
            self.conn = sqlite3.connect(DatabaseConfig.PATH)
            self.cursor = self.conn.cursor()
            self.create_tables()
        
        else:
            self.conn = sqlite3.connect(DatabaseConfig.PATH)
            self.cursor = self.conn.cursor()
            
    @staticmethod
    def get_instance():
        if DBManager.INSTANCE is None:
            DBManager.INSTANCE = DBManager()
        return DBManager.INSTANCE

    def create_tables(self):
        self.execute(
            "CREATE TABLE users (id INTEGER, username TEXT, email TEXT, password TEXT)"
        )
        self.execute(
            "CREATE TABLE projects (project_id INTEGER, user_id INTEGER, admin BOOLEAN, container_id TEXT DEFAULT NULL)"
        )
        self.execute(
            "CREATE TABLE user_tokens (user_id INTEGER, token TEXT, timestamp TEXT)"
        )
        self.execute(
            "CREATE TABLE user_invites (user_id INTEGER, project_id INTEGER)"
        )
    
    def execute(self, query: str, *args):
        self.cursor.execute(query, args)
        self.conn.commit()
        ret = self.cursor.fetchall()
        
        if not ret: return None
        if len(ret) == 1: return ret[0]
        else: return ret

    def close(self):
        self.conn.close()
        self.cursor.close()

    def create_user(self, username: str,  email: str, password: str):
        # Generate id
        # If the table is empty, set the id to 0.
        user_id = self.execute("SELECT MAX(id) FROM users")[0]
        user_id = 0 if user_id is None else user_id + 1

        self.execute(f"INSERT INTO users (id, username, email, password) VALUES {user_id, username, email, password}")
        return user_id
    
    def update_user(self, user_id: int, username: str, email: str, password: str):
        self.execute(f"UPDATE users SET username = '{username}', email = '{email}', password = '{password}' WHERE id = {user_id}")

    def get_user_password(self, user_id: int):
        return self.execute(f"SELECT password FROM users WHERE id = {user_id}")[0]
    
    def get_user_by_email(self, email: str):
        """
        Returns a tuple containing the user's id, username, email, and password.
        """
        return self.execute(f"SELECT * FROM users WHERE email = '{email}'")
    
    def get_user_by_username(self, username: str):
        """
        Returns a tuple containing the user's id, username, email, and password.
        """
        return self.execute(f"SELECT * FROM users WHERE username = '{username}'")
    
    def get_user_by_id(self, user_id: int): 
        return self.execute(f"SELECT * FROM users WHERE id = {user_id}")
    
    def create_project(self, user_id: int):
        # Generate id
        project_id = self.execute("SELECT MAX(project_id) FROM projects")[0]
        if project_id is None: project_id = 0
        else: project_id = 0 if project_id is None else project_id + 1

        self.execute(f"INSERT INTO projects (project_id, user_id, admin) VALUES {project_id, user_id, True}")
        return project_id

    def add_user_to_project(self, user_id: int, project_id: int):
        self.execute(f"INSERT INTO projects (project_id, user_id, admin) VALUES {project_id, user_id, False}")

    def get_projects_for_user(self, user_id: int):
        ret = self.execute(f"SELECT project_id FROM projects WHERE user_id = {user_id}")
        if ret is None: return None
        if len(ret) == 1: return ret[0]
        return [x[0] for x in ret] if ret is not None else None
    
    def check_user_permission(self, user_id: int, project_id: int):
        return self.execute(f"SELECT project_id FROM projects WHERE project_id = {project_id} AND user_id = {user_id}") is not None
    
    def is_user_admin(self, user_id: int, project_id: int):
        return self.execute(f"SELECT admin FROM projects WHERE user_id = {user_id} AND project_id = {project_id}")[0]
    
    def delete_project(self, project_id: int):
        self.execute(f"DELETE FROM projects WHERE project_id = {project_id}")

    def delete_project_for_user(self, user_id: int, project_id: int):
        self.execute(f"DELETE FROM projects WHERE user_id = {user_id} AND project_id = {project_id}")

    def set_container_id(self, project_id: int, container_id: str):
        self.execute(f"UPDATE projects SET container_id = '{container_id}' WHERE project_id = {project_id}")

    def get_container_id(self, project_id: int):
        id = self.execute(f"SELECT container_id FROM projects WHERE project_id = {project_id}")
        if id is None or id[0] is None: return None
        return id[0][0] 

    def create_token(self, user_id: int, token: str, timestamp: str):
        self.execute(f"INSERT INTO user_tokens (user_id, token, timestamp) VALUES {user_id, token, timestamp}")

    def get_user_id_by_token(self, token: str):
        ret = self.execute(f"SELECT user_id FROM user_tokens WHERE token = '{token}'")
        if ret is None: return None
        return ret[0]
    
    def delete_token(self, token: str):
        self.execute(f"DELETE FROM user_tokens WHERE token = '{token}'")

    def create_invite(self, user_id: int, project_id: int):
        self.execute(f"INSERT INTO user_invites (user_id, project_id) VALUES {user_id, project_id}")

    def get_invites_for_user(self, user_id: int):
        ret = self.execute(f"SELECT project_id FROM user_invites WHERE user_id = {user_id}")
        if ret is None: return None
        if len(ret) == 1: return ret
        return [x[0] for x in ret] if ret is not None else None
    
    def delete_invite(self, user_id: int, project_id: int):
        self.execute(f"DELETE FROM user_invites WHERE user_id = {user_id} AND project_id = {project_id}")

    def get_users_for_project(self, project_id: int):
        ret = self.execute(f"SELECT user_id FROM projects WHERE project_id = {project_id}")
        if ret is None: return None
        if len(ret) == 1: return ret
        return [x[0] for x in ret] if ret is not None else None
    
    def remove_user_from_project(self, user_id: int, project_id: int):
        self.execute(f"DELETE FROM projects WHERE user_id = {user_id} AND project_id = {project_id}")

    
