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
            "CREATE TABLE users (id INTEGER, username TEXT, password TEXT)"
        )
        self.execute(
            "CREATE TABLE permissions (project_id INTEGER, project_name TEXT, user_id INTEGER)"
        )
    
    def execute(self, query: str, *args):
        self.cursor.execute(query, args)
        self.conn.commit()
        return self.cursor.fetchall()
    
    def close(self):
        self.conn.close()
        self.cursor.close()

    def create_user(self, username: str, password: str):
        # Generate id
        # If the table is empty, set the id to 0.
        if self.execute("SELECT MAX(id) FROM users")[0][0] is None:
            user_id = 0
        else: user_id = self.execute("SELECT MAX(id) FROM users")[0][0] + 1
        self.execute(f"INSERT INTO users (id, username, password) VALUES {user_id, username, password}")

    
    def get_user(self, username: str):
        return self.execute(f"SELECT * FROM users WHERE username = '{username}'")
    
    def create_project(self, name: str, user_id: int):

        # Generate id
        project_id = self.execute("SELECT MAX(id) FROM permissions")[0][0] + 1
        if project_id is None: project_id = 0

        self.execute(f"INSERT INTO permissions (project_id, project_name, user_id) VALUES {project_id, name, user_id}")

    def get_project_name_by_id(self, project_id: int):
        return self.execute(f"SELECT project_name FROM permissions WHERE project_id = {project_id}")
    
    def get_project_id_by_name(self, name: str):
        return self.execute(f"SELECT project_id FROM permissions WHERE project_name = {name}")
    
    def add_permission(self, project_id: int, user_id: int):
        self.execute(f"INSERT INTO permissions (project_id, user_id) VALUES {project_id, user_id}")
    
