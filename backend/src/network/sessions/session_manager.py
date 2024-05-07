from constants import Project
from network.sessions import Session
from typing import Dict

class SessionManager:
    __instance = None

    def __init__(self):
        self.sessions: Dict[int, Session] = {}

    @staticmethod
    def get_instance():
        if SessionManager.__instance is None:
            SessionManager.__instance = SessionManager()

        return SessionManager.__instance

    def get_session(self, project: Project) -> Session:
        session = self.sessions.get(project.id)
        if session is None or len(session._clientHandlers) == 0:
            self.sessions[project.id] = Session(project)

        return self.sessions[project.id]