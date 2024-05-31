import os
import dataclasses


class NetworkConfig:
    COM_PORT = 5800
    EXECUTER_IO_PORT = 5801
    LENGTH_HEADER_SIZE = 4

    CERT_PATH = os.path.normpath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.keys/cert.pem"
    ))

    KEY_PATH = os.path.normpath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.keys/key.pem")
    )

    PEPPER = "waabTWDf301n5XJRw71qbkXvYdMi7vOA"

    AES_KEY_PATH = os.path.normpath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.keys/aes_key.bin")
    )

class DatabaseConfig:
    PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database/database.db")

class StorageConfig:
    PROJECTS_PATH = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../Storage"))
    FILES_HEADER_BASE_PATH = "Storage"
    HIDDEN_FILES = [
        "metadata.json",
        "__pycache__"
    ]

class ShareDBConfig:
    ID_HEADER = "file:///"


class ExecuterConfig:
    IMAGE = "executer"
    WORKING_DIR = "/app"
    COMMAND = "/bin/bash"
    COMMAND_FINISH_MARKER = "__COMMAND_FINISHED__"


@dataclasses.dataclass
class Account:
    id: int
    name: str
    email: str

@dataclasses.dataclass
class Project:
    id: int
    name: str
    author: str
    description: str
    admin: bool