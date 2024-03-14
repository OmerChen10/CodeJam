import json
from Constants import StorageConfig
import os


class Project():
    def __init__(self, **kwargs):
        self.id = kwargs.get("id")
        self.author = kwargs.get("author")
        self.name = kwargs.get("name")
        self.description = kwargs.get("description")

        self.path = os.path.join(StorageConfig.PROJECTS_PATH, str(self.id))
        if not os.path.exists(self.path):
            self.init_project()


    def __str__(self):
        return f"Project: ID: {self.id}, Name: {self.name}, Description: {self.description}"
    
    def init_project(self):
        os.mkdir(self.path)
        self.update_metadata()

    def update_metadata(self):
        with open(os.path.join(self.path, "metadata.json"), "wb") as file:
            metadata = {
                "id": self.id,
                "name": self.name,
                "description": self.description,
                "author": self.author
            }
            file.write(json.dumps(metadata).encode("utf-8"))

    def get_metadata(self):
        with open(self.path, "metadata.json") as file:
            return json.load(file)
        
    
