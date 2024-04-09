from projects import ProjectExecuter
from ExecuterIOClient import ExecuterIOClient


class ExecutionManager:
    def __init__(self):
        self.executers: dict[int, ProjectExecuter] = {}
        self.io_client = ExecuterIOClient.get_instance()

        @self.io_client.onEvent
        def create_executer(data):
            print(data)
            self.create_executer(data["project_id"], data["file_name"])

        @self.io_client.onEvent
        def pass_input(data):
            self.pass_input(data["project_id"], data["input"])

        @self.io_client.onEvent
        def kill(data):
            self.executers[data["project_id"]].kill()

    def create_executer(self, project_id, file_name):
        self.executers[project_id] = ProjectExecuter(project_id, file_name)
        return self.executers[project_id]

    def pass_input(self, project_id, input):
        self.executers[project_id].send_input(input)

    