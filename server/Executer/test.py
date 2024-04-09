import time
import docker
import os
import threading

dir = os.path.dirname(os.path.abspath(__file__))

client = docker.from_env()
container = client.containers.run("executer", command="/bin/bash", detach=True, stdin_open=True, volumes={
    f"{dir}/src": {"bind": "/app/src", "mode": "rw"}
})

socket = container.attach_socket(params={'stdin': 1, 'stream': 1})
# Send input to the container

def read_output():
    output = container.logs(stream=True)

    while True:
        for line in output:
            print(line.decode().strip())

# Receive output from the container
threading.Thread(target=read_output).start()
while True:
    socket.send(input().encode() + b"\n")



