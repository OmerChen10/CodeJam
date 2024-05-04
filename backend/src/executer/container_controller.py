from constants import Project, ExecuterConfig, StorageConfig
from database import DBManager
import threading
import docker
import os
import atexit


class ContainerController:
    def __init__(self, project: Project, web_clients):
        from network import ClientIO
        
        self.project_path = os.path.join(
            StorageConfig.PROJECTS_PATH, str(project.id))
        self.web_clients: list[ClientIO] = web_clients
        self.project = project
        self.db_manager = DBManager.get_instance()

        self.client = docker.from_env()
        self.container = self.get_container()

        atexit.register(self.close)

        self.stdout = self.container.logs(
            stream=True, stdout=True, stderr=True)

        self.stdin = self.container.attach_socket(
            params={"stdin": 1, "stream": 1})

        self.stdout_thread = threading.Thread(
            target=self.handle_output, args=(self.stdout, "stdout"))

        self.stdout_thread.start()

    def handle_output(self, stream, stream_type: str):
        buffer = b""
        for text in stream:
            buffer += text
            if b"\n" in buffer or b"\r" in buffer:
                self.broadcast(f"executerStdout", buffer.decode("utf-8"))
                buffer = b""

    def send_input(self, input: str):
        self.stdin.send((input + "\n").encode("utf-8"))

    def get_container(self):
        past_container = self.db_manager.get_container_id(self.project.id)
        if past_container is None:
            container = self.create_container()
            self.broadcast("showToast", "User environment created.")
            self.db_manager.set_container_id(self.project.id, container.id)
            return container
        
        try:
            container = self.client.containers.get(past_container)
            # Run the container if it is not running/
            if container.status != "running":
                container.start()

            self.broadcast("showToast", "User environment loaded.")
            return container

        except:
            container = self.create_container()
            self.db_manager.set_container_id(self.project.id, container.id)
            return container

    def create_container(self):
        return self.client.containers.run(
            image=ExecuterConfig.IMAGE,
            command=ExecuterConfig.COMMAND,
            volumes={self.project_path: {
                "bind": f"{ExecuterConfig.WORKING_DIR}/{self.project.name}", "mode": "rw"}},
            detach=True,
            stdin_open=True,
            tty=True,
            working_dir=f"/app/{self.project.name}",
            environment={"PYTHONUNBUFFERED": "1", "TERM": "dumb", "PS1": "$ "}
        )

    def broadcast(self, event_name: str, server_msg) -> None:
        for web_client in self.web_clients:
            web_client.send(event_name, server_msg)

    def close(self):
        self.send_input("exit")
        self.stdin.close()