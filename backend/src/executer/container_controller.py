from constants import Project, ExecuterConfig, StorageConfig
from database import DBManager
from utils import Logger
import threading
import docker
import os
import atexit


class ContainerController:
    def __init__(self, project: Project, web_clients):
        from network import ClientHandler
        
        # Set the project path based on the project id
        self.project_path = os.path.join(
            StorageConfig.PROJECTS_PATH, str(project.id), "src")
        
        self.web_clients: list[ClientHandler] = web_clients
        self.project = project
        self.db_manager = DBManager.get_instance()

        self.client = docker.from_env()
        self.container = self.get_container()

        atexit.register(self.close)

        # Setup the container's stdout and stderr
        self.stdout = self.container.logs(
            stream=True, stdout=True, stderr=True)

        # Attach to the container's stdin
        self.stdin = self.container.attach_socket(
            params={"stdin": 1, "stream": 1})

        self.stdout_thread = threading.Thread(
            target=self.handle_output, args=(self.stdout,))

        self.stdout_thread.start()

    @Logger.catch_exceptions
    def handle_output(self, stream):
        buffer = b""
        for text in stream:
            buffer += text
            # If a newline character is found, broadcast the message
            if b"\n" in buffer or b"\r" in buffer:
                if buffer == b"\n" or buffer == b"\r" or b"user@" in buffer:
                    buffer = b""
                    continue
                
                self.broadcast("executerStdout", buffer.decode("utf-8"))
                buffer = b""

    @Logger.catch_exceptions
    def send_input(self, input: str):
        # Send the input to the container
        self.stdin.send((input + "\n").encode("utf-8"))

    @Logger.catch_exceptions
    def get_container(self):
        # Get the past container based on the project id
        past_container = self.db_manager.get_container_id(self.project.id)
        if past_container is None:
            container = self.create_container()
            self.db_manager.set_container_id(self.project.id, container.id)
            return container
        
        try:
            container = self.client.containers.get(past_container)
            # Run the container if it is not running
            if container.status != "running":
                container.start()

            return container

        except Exception as e:
            Logger.log_info(f"Container not found: {e}")
            container = self.create_container()
            self.db_manager.set_container_id(self.project.id, container.id)
            return container

    @Logger.catch_exceptions
    def create_container(self):
        return self.client.containers.run(
            image=ExecuterConfig.IMAGE,
            command=ExecuterConfig.COMMAND, # Run the bash shell
            volumes={self.project_path: { # Setup the volume
                "bind": f"{ExecuterConfig.WORKING_DIR}/{self.project.name}", "mode": "rw"}},
            detach=True, # Run the container in the background
            stdin_open=True,
            tty=True, # Allocate a pseudo-TTY
            working_dir=f"/app/{self.project.name}", 
            environment={"PYTHONUNBUFFERED": "1", "TERM": "dumb", "PS1": "$ "}
        )

    @Logger.catch_exceptions
    def broadcast(self, event_name: str, server_msg) -> None:
        for web_client in self.web_clients:
            web_client.socket.send(event_name, server_msg)

    @Logger.catch_exceptions
    def close(self):
        self.send_input("exit")
        self.stdin.close()
