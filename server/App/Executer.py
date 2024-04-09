from Constants import Project
from Constants import StorageConfig
from Network import ClientIO
import threading
import docker
import os
import time

class Executer:
    def __init__(self, project: Project, web_client: ClientIO):
        self.project_path = os.path.join(StorageConfig.PROJECTS_PATH, str(project.id))
        self.web_client = web_client

        self.client = docker.from_env()
        self.container = self.client.containers.run(
            image="executer",
            command="/bin/bash",
            volumes={self.project_path: {"bind": f"/app/{project.name}", "mode": "rw"}},
            detach=True,
            stdin_open=True,
            remove=True
        )

        self.output_thread = threading.Thread(target=self.output_listener, daemon=True)
        self.output_thread.start()

        self.com_socket = self.container.attach_socket(params={'stdin': True, 'stream': True})
         
    def send_input(self, input: str):
        self.com_socket.send(input.encode() + b"\n")

    def output_listener(self):
        self.stdout = self.container.logs(stream=True, stderr=False)
        self.stderr = self.container.logs(stream=True, stdout=False)

        while True:
            if self.stdout:
                for line in self.stdout:
                    self.web_client.send("executer_output", line.decode("utf-8"))
            
            if self.stderr:
                for line in self.stderr:
                    self.web_client.send("executer_error", line.decode("utf-8"))
            
            time.sleep(0.1)

    def close(self):
        self.com_socket.close()
        self.container.stop()
        self.container.remove()
        self.output_thread.join()
