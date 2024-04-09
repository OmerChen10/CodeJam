import os
import dataclasses


class NetworkConfig:
    COM_PORT = 5800
    EXECUTER_IO_PORT = 5801
    LENGTH_HEADER_SIZE = 4

class DatabaseConfig:
    PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "App\database\database.db")

class StorageConfig:
    PROJECTS_PATH = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../Storage"))
    FILES_HEADER_BASE_PATH = "Storage"

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