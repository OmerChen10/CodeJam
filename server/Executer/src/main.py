import time
from ExecuterIOClient import ExecuterIOClient
from Logger import Logger
from projects import ExecutionManager


def main():
    Logger.log_info("Starting ExecuterIO client")
    em = ExecutionManager()
    conn = ExecuterIOClient.get_instance()

    conn.connect()
    conn.start()

if __name__ == "__main__":
    print("Input: " + input())
    print("Project done")
    print("Preforming error")
    raise Exception("Error")
