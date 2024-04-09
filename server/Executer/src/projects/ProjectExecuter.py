from ExecuterIOClient import ExecuterIOClient
import subprocess
import time
import os


class ProjectExecuter:
    def __init__(self, project_id, file_name):
        self.project_id = project_id
        self.file_name = file_name
        self.file_type = file_name.split(".")[-1]

        self.project_path = f"/app/Storage/{project_id}"

        self.io_client = ExecuterIOClient.get_instance()

        self.execute()

    
    def execute(self):
        cmd = self._get_cmd()
        self._process = subprocess.Popen(cmd, 
                                   cwd=self.project_path, 
                                   stdin=subprocess.PIPE, 
                                   stdout=subprocess.PIPE, 
                                   stderr=subprocess.PIPE)
        
        while self._process.poll() is None:
            self.send_states()
            time.sleep(0.1)

        self.io_client.send("execution_finished", {"project_id": self.project_id})


    def _get_cmd(self):
        match self.file_type:
            case "py":
                return ["python", self.file_name]
            case "java":
                return ["java", self.file_name]
            case "js":
                return ["node", self.file_name]

    def send_input(self, input):
        self._process.stdin.write(input.encode())
        self._process.stdin.flush()

    def send_states(self):
        output = self._process.stdout.read()
        if output:
            self.io_client.send("stdout", {"project_id": self.project_id, "output": output.decode()})

        output = self._process.stderr.read()
        if output:
            self.io_client.send("stderr", {"project_id": self.project_id, "output": output.decode()})

    def kill(self):
        self._process.kill()


