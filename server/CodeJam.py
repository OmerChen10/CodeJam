import os
import subprocess
from Logger import Logger

class CodeJamServer():
    def __init__(self, dev_mode=False) -> None:
        self.dev_mode = dev_mode
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


    def run(self):
        Logger.log_info("==================== Starting CodeJam server ====================")
        if self.dev_mode:
            Logger.log_info("Running in dev mode")
            Logger.log_info("Starting server")
            subprocess.Popen(['npm', 'run', 'dev'], shell=True, cwd=self.root_dir)
            Logger.log_info("Server running")

        else:
            Logger.log_info("Running in prod mode")
            Logger.log_info("Building React app")
            subprocess.Popen(['npm', 'run', 'build'], shell=True, cwd=self.root_dir).wait()
            Logger.log_info("Build complete")
            Logger.log_info("Starting server")
            subprocess.Popen(['npx', 'serve', 'dist/'], shell=True, cwd=self.root_dir)
            Logger.log_info("Server running")




            
