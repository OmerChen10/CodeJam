from constants import StorageConfig
from utils import Logger
import json
import os
import shutil

class StorageManager():
    def __init__(self, **kwargs):
        pass

    def create_project(self, **kwargs):
        id = kwargs.get("id")
        author = kwargs.get("author")
        name = kwargs.get("name")
        description = kwargs.get("description")

        path = os.path.join(StorageConfig.PROJECTS_PATH, str(id))
        os.mkdir(path)
        self.update_metadata(path=path, id=id, author=author, name=name, description=description)
    
    def update_metadata(self, **kwargs):
        with open(os.path.join(StorageConfig.PROJECTS_PATH, str(kwargs["id"]), "metadata.json"), "wb") as file:
            metadata = {
                "id": kwargs["id"],
                "name": kwargs["name"],
                "description": kwargs["description"],
                "author": kwargs["author"]
            }
            file.write(json.dumps(metadata).encode("utf-8"))

    def get_metadata(self, project_id):
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id))
        with open(os.path.join(path, "metadata.json"), "rb") as file:
            return json.load(file)
        
    def delete_project(self, project_id):
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id))
        shutil.rmtree(path)
    
    def get_files(self, project_id):
        # Get the list of file names in the project directory.
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id))
        filenames = os.listdir(path)
        return [file for file in filenames if file not in StorageConfig.HIDDEN_FILES]

    def create_file(self, project_id, name):
        # Check if the file already exists.
        file_list = os.listdir(os.path.join(StorageConfig.PROJECTS_PATH, str(project_id)))
        file_num = len([file for file in file_list if name in file])
        if file_num > 0:
            name = f"{name} ({file_num})"
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), name)
        with open(path, "wb") as file:
            file.write(b"")

        return True

    def edit_file_name(self, project_id, old_name, new_name):
        old_path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), old_name)
        new_path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), new_name)
        os.rename(old_path, new_path)
        return True
    
    def delete_file(self, project_id, name):
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), name)
        os.remove(path)
        return True
    
    def save_file(self, project_id, name, content):
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), name)
        with open(path, "wb") as file:
            file.write(content.encode("utf-8"))
        return True
    
    def get_file(self, project_id, name):
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), name)
        with open(path, "rb") as file:
            return file.read().decode("utf-8")