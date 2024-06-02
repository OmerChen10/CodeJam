import os
import dataclasses


class EmailConfig:
    CODE_EXPIRATION = 60 * 5 # 5 minutes
    CODE_LENGTH = 6

    EMAIL_CREDENTIALS_PATH = os.path.normpath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.credentials/email.txt")
    )

    EMAIL_HTML_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "email-message.html")

class SecurityConfig:
    PEPPER = "waabTWDf301n5XJRw71qbkXvYdMi7vOA"

    AES_KEY_PATH = os.path.normpath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.credentials/aes_key.bin")
    )

class NetworkConfig:
    COM_PORT = 5800
    EXECUTER_IO_PORT = 5801
    LENGTH_HEADER_SIZE = 4

    CERT_PATH = os.path.normpath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.credentials/cert.pem"
    ))

    KEY_PATH = os.path.normpath(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.credentials/key.pem")
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