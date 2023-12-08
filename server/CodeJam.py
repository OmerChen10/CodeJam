import os
import subprocess
from Logger import Logger
from Network import NetworkManger


class CodeJamServer():
    def __init__(self, dev_mode=False) -> None:
        self.dev_mode = dev_mode
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.nm = NetworkManger()


    def run(self):
        self.start_react()
        self.nm.start()

    
    def start_react(self):
        Logger.log_info("==================== Starting CodeJam server ====================")

        if self.dev_mode:
            Logger.log_info("Running in dev mode")
            Logger.log_info("Starting server")
            subprocess.Popen(['npm', 'run', 'dev'], 
                             shell=True, 
                             cwd=self.root_dir, 
                             stdout=subprocess.DEVNULL)
            
            Logger.log_info("Server running")

        else:
            Logger.log_info("Running in prod mode")
            Logger.log_info("Building React app")
            subprocess.Popen(['npm', 'run', 'build'], shell=True, cwd=self.root_dir).wait()
            Logger.log_info("Build complete")
            Logger.log_info("Starting server")
            subprocess.Popen(['npm', 'run', 'preview'], 
                             shell=True, 
                             cwd=self.root_dir,
                             stdout=subprocess.DEVNULL)
            
            Logger.log_info("Server running")




            
