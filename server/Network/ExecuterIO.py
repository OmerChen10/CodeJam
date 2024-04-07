import time
from Constants import NetworkConfig
from Logger import Logger
import socket
import json
import threading

class ExecuterIOServer(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.daemon = True
        self.handler_map = {}

        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.bind(('localhost', NetworkConfig.EXECUTER_IO_PORT))
        self.server.listen(1)
        
    @Logger.catch_exceptions
    def run(self):

        Logger.log_info("ExecuterIO server started on port " + str(NetworkConfig.EXECUTER_IO_PORT))
        self.conn, _ = self.server.accept()

        while True:
            self.receive()

    @Logger.catch_exceptions
    def send(self, eventName, data):
        msg = json.dumps({"eventName": eventName, "data": data})
        msg_length = str(len(msg)).zfill(NetworkConfig.LENGTH_HEADER_SIZE)
        self.conn.send(msg_length.encode())
        self.conn.send(msg.encode())

    @Logger.catch_exceptions
    def receive(self):
        length = self.conn.recv(NetworkConfig.LENGTH_HEADER_SIZE)
        if not length: return
        msg_length = int(length.decode())
        msg = self.conn.recv(msg_length).decode()
        eventName, data = json.loads(msg).values()

        if eventName not in self.handler_map.keys():
            Logger.log_info(f"[ExecuterIO Server] Event {eventName} not found.")
            return
        
        self.handler_map[eventName](data)

    @Logger.catch_exceptions
    def onEvent(self, func):
        self.handler_map[func.__name__] = func

    
