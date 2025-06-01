from network import NetworkManger
from utils import Logger
import os


class CodeJamServer():
    def __init__(self, dev_mode=False) -> None:
        self.dev_mode = dev_mode
        self.root_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))

        self.manager = NetworkManger()

    def run(self):
        Logger.log_info("==================== Starting CodeJam server ====================")
        self.manager.start()
        Logger.log_info("Server running")
