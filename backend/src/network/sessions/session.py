from constants import Project
from executer import ContainerController
from utils import Logger

class Session():
    def __init__(self, project: Project) -> None:
        self.project = project
        self._sockets = []
        self.controller = ContainerController(project, self._sockets)

    @Logger.catch_exceptions
    def join(self, socket):
        self._sockets.append(socket)
        socket.setDisconnectHandler(lambda: self.leave(socket))


    @Logger.catch_exceptions
    def leave(self, socket):
        self._sockets.remove(socket)
        if len(self._sockets) == 0:
            Logger.log_info(f"[Session] No clients connected to project: {self.project.name}. Closing the session.")
            self.controller.close()


    @Logger.catch_exceptions
    def broadcast(self, curr_socket, event_name: str, server_msg) -> None:
        for socket in self._sockets:
            if socket is curr_socket: continue
            socket.send(event_name, server_msg)

    
