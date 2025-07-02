import os


APPLICATION_PATH = os.path.join("/etc", "codejam")


class EmailConfig:
    CODE_EXPIRATION = 60 * 5  # 5 minutes
    CODE_LENGTH = 6

    EMAIL_CREDENTIALS_PATH = os.path.join(
        APPLICATION_PATH, "credentials", "email.txt")
    EMAIL_HTML_PATH = os.path.join("/app", "assets", "email-message.html")


class SecurityConfig:
    PEPPER = "waabTWDf301n5XJRw71qbkXvYdMi7vOA"
    AES_KEY_PATH = os.path.join(APPLICATION_PATH, "credentials", "aes_key.bin")


class NetworkConfig:
    COM_PORT = 5800
    EXECUTER_IO_PORT = 5801
    LENGTH_HEADER_SIZE = 4
    SSL_ENABLED = True

    CERT_PATH = os.path.join(APPLICATION_PATH, "credentials", "cert.pem")
    KEY_PATH = os.path.join(APPLICATION_PATH, "credentials", "key.pem")


class DatabaseConfig:
    PATH = os.path.join(APPLICATION_PATH, "persistent", "database.db")


class StorageConfig:
    PROJECTS_PATH = os.path.join(APPLICATION_PATH, "persistent", "storage")
    FILES_HEADER_BASE_PATH = "storage"
    HIDDEN_FILES = [
        "metadata.json",
        "__pycache__"
    ]


class ShareDBConfig:
    ID_HEADER = "file:///"
    MONGO_URI = "mongodb://mongo:27017"


class ExecuterConfig:
    IMAGE = "env-base"
    WORKING_DIR = "/app"
    COMMAND = "/bin/bash"
    COMMAND_FINISH_MARKER = "__COMMAND_FINISHED__"

class LoggerConfig:
    LOG_FILE_PATH = os.path.join(APPLICATION_PATH, "persistent", "server.log")