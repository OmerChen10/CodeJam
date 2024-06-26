from constants import Project
from executer import ContainerController
from utils import Logger

class Session():
    def __init__(self, project: Project) -> None:
        from network import ClientHandler

        self.project = project
        self._clientHandlers: list[ClientHandler] = []
        self.controller = ContainerController(project, self._clientHandlers)

    @Logger.catch_exceptions
    def join(self, handler):
        """ Add a client to the session. """
        self._clientHandlers.append(handler)
        handler.socket.setDisconnectHandler(lambda: self.leave(handler))
        handler.socket.send("showInfoToast", "Connected to session")


    @Logger.catch_exceptions
    def leave(self, handler):
        """ Remove a client from the session. """
        if handler in self._clientHandlers:
            self._clientHandlers.remove(handler)
            if len(self._clientHandlers) == 0:
                Logger.log_info(f"Closing session for project {self.project.id}")
                self.controller.close()


    @Logger.catch_exceptions
    def broadcast(self, curr_handler, event_name: str, server_msg) -> None:
        """ Broadcast a message to all clients in the session. """
        for handler in self._clientHandlers:
            if handler is curr_handler: continue
            handler.socket.send(event_name, server_msg)

    @Logger.catch_exceptions
    def get_users(self):
        """ Get the list of users in the session. """
        return self._clientHandlers

    
