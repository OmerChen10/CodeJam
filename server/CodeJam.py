import os
import subprocess
import time
from Logger import Logger
from Network import NetworkManger
from Network.ExecuterIO import ExecuterIOServer

class CodeJamServer():
    def __init__(self, dev_mode=False) -> None:
        self.dev_mode = dev_mode
        self.root_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))
        self.manager = NetworkManger()
        self.executer_io_server = ExecuterIOServer()

        @self.executer_io_server.onEvent
        def echo(data):
            print(data)

    def run(self):
        self.start_react()
        self.start_executer_container()
        self.manager.start()
        self.executer_io_server.start()

    def start_react(self):
        Logger.log_info(
            "==================== Starting CodeJam server ====================")

        if self.dev_mode:
            Logger.log_info("Running in dev mode")
            subprocess.Popen(['npm', 'run', 'dev'],
                             shell=True,
                             cwd=self.root_dir,
                             stdout=subprocess.DEVNULL)

            Logger.log_info("Server running")

        else:
            Logger.log_info("Running in prod mode")
            subprocess.Popen(['npm', 'run', 'build'],
                             shell=True, cwd=self.root_dir).wait()
            Logger.log_info("Starting server")
            subprocess.Popen(['npm', 'run', 'preview'],
                             shell=True,
                             cwd=self.root_dir,
                             stdout=subprocess.DEVNULL)

            Logger.log_info("Server running")

    def start_executer_container(self):
        storage_path = os.path.join(self.root_dir, 'Storage')
        container_code_path = os.path.join(self.root_dir, 'server', 'Executer', 'src')
        subprocess.run(['start', 'cmd', '/k', 'docker', 'run', '--rm', '-v', 
                        f'{storage_path}:/app/Storage', '-v',
                        f'{container_code_path}:/app/src', 'executer'],
                         cwd=self.root_dir, shell=True)




        
        
