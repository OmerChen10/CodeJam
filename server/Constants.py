import os

class NetworkConfig:
    COM_PORT = 5800

class DatabaseConfig:
    PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "App\database\database.db")