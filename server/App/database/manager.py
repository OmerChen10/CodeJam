from Constants import DatabaseConfig
from Logger import Logger
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
            "CREATE TABLE permissions (project_id INTEGER, user_id INTEGER)"
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

    
    def get_user(self, email: str):
        return self.execute(f"SELECT * FROM users WHERE email = '{email}'")
    
    def create_project(self, user_id: int):

        # Generate id
        project_id = self.execute("SELECT MAX(project_id) FROM permissions")[0]
        if project_id is None: project_id = 0
        else: project_id = 0 if project_id is None else project_id + 1

        self.execute(f"INSERT INTO permissions (project_id, user_id) VALUES {project_id, user_id}")
        return project_id


    def get_projects_for_user(self, user_id: int):
        ret = self.execute(f"SELECT project_id FROM permissions WHERE user_id = {user_id}")
        if ret is None: return None
        if len(ret) == 1: return ret[0]
        return [x[0] for x in ret] if ret is not None else None
        
    
    def delete_project(self, project_id: int):
        self.execute(f"DELETE FROM permissions WHERE project_id = {project_id}")
    
