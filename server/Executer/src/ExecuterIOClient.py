from Constants import NetworkConfig
from Logger import Logger
import socket
import json
import threading
import time

class ExecuterIOClient(threading.Thread):
    _instance = None

    def __init__(self):
        super().__init__()
        self.handler_map = {}
        self.conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.running = True

    @staticmethod
    def get_instance():
        if not ExecuterIOClient._instance:
            ExecuterIOClient._instance = ExecuterIOClient()
        return ExecuterIOClient._instance
    
    def run(self):
        while self.running:
            self.receive()
            time.sleep(0.1)

    def connect(self):
        self.conn.connect(('host.docker.internal', NetworkConfig.EXECUTER_IO_PORT))
        Logger.log_info("ExecuterIO client connected to port " + str(NetworkConfig.EXECUTER_IO_PORT))

    def send(self, eventName, data):
        msg = json.dumps({"eventName": eventName, "data": data})
        msg_length = str(len(msg)).zfill(NetworkConfig.LENGTH_HEADER_SIZE)
        self.conn.send(msg_length.encode())
        self.conn.send(msg.encode())

    def receive(self):
        length = self.conn.recv(NetworkConfig.LENGTH_HEADER_SIZE)
        if length == b'': self.close()
        if not length: return

        msg_length = int(length.decode())
        msg =  self.conn.recv(msg_length).decode()
        eventName, data = json.loads(msg).values()

        if eventName not in self.handler_map.keys():
            Logger.log_info(f"[ExecuterIO Server] Event {eventName} not found.")
            return
        
        try: data = json.loads(data)
        except: pass
        
        self.handler_map[eventName](data)

    def onEvent(self, func):
        self.handler_map[func.__name__] = func

    def close(self):
        self.conn.close()
        self.running = False


    
