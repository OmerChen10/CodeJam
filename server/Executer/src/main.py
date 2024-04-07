from ExecuterIOClient import ExecuterIOClient
from Logger import Logger

def main():
    Logger.log_info("Starting ExecuterIO client")
    io_client = ExecuterIOClient()
    io_client.connect()
    io_client.start()

    @io_client.onEvent
    def echo(data):
        Logger.log_info(f"Received {data}")

if __name__ == "__main__":
    main()