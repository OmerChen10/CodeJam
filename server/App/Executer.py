from Constants import Project
from Constants import StorageConfig, ExecuterConfig
from Network import ClientIO
from App.database.manager import DBManager
import threading
import docker
import os
import time
import atexit


class Executer:
    def __init__(self, project: Project, web_client: ClientIO):
        self.project_path = os.path.join(
            StorageConfig.PROJECTS_PATH, str(project.id))
        self.web_client = web_client
        self.project = project
        self.db_manager = DBManager.get_instance()

        self.client = docker.from_env()
        self.container = self.get_container()

        atexit.register(self.close)

        self.stdout = self.container.logs(
            stream=True, stdout=True, stderr=True)
        # self.stderr = self.container.logs(
        #     stream=True, stdout=False, stderr=True)
        self.stdin = self.container.attach_socket(
            params={"stdin": 1, "stream": 1})

        self.stdout_thread = threading.Thread(
            target=self.handle_output, args=(self.stdout, "stdout"))
        # self.stderr_thread = threading.Thread(
        #     target=self.handle_output, args=(self.stderr, "stderr"))
        self.stdout_thread.start()
        # self.stderr_thread.start()

    def handle_output(self, stream, stream_type: str):
        buffer = b""
        for text in stream:
            buffer += text
            if b"\n" in buffer or b"\r" in buffer:
                self.web_client.send(
                    f"executer{stream_type.capitalize()}", buffer.decode("utf-8"))
                buffer = b""

    def send_input(self, input: str):
        self.stdin.send((input + "\n").encode("utf-8"))

    def get_container(self):
        past_container = self.db_manager.get_container_id(self.project.id)
        if past_container is None:
            container = self.create_container()
            self.web_client.send("showToast", "User environment created.")
            self.db_manager.set_container_id(self.project.id, container.id)
            return container
        
        try:
            container = self.client.containers.get(past_container)
            # Run the container if it is not running
            if container.status != "running":
                container.start()

            self.web_client.send("showToast", "User environment loaded.")
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

    def close(self):
        self.send_input("exit")
        self.stdin.close()
