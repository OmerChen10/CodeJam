from network import NetworkManger
from constants import WebsiteServerConfig, ShareDBConfig
from utils import Logger
import subprocess
import os


class CodeJamServer():
    def __init__(self, dev_mode=False) -> None:
        self.dev_mode = dev_mode
        self.root_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))

        self.manager = NetworkManger()

    def run(self):
        self.start_shareDB_server()
        self.start_http_server()
        self.manager.start()

    def start_http_server(self):
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
            subprocess.Popen(['node', os.path.join(WebsiteServerConfig.SERVER_PATH, 'server.cjs')],
                             shell=True)
            
            Logger.log_info("Server running")

    def start_shareDB_server(self):
        Logger.log_info("Starting ShareDB server")
        subprocess.Popen(['node', ShareDBConfig.SERVER_PATH],
                         shell=True, cwd=self.root_dir,
                         stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL)
        
        Logger.log_info("ShareDB server running")
