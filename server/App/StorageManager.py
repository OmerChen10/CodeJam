from Constants import StorageConfig
from Logger import Logger
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
        # Run a check for the path - inside the StorageConfig.PROJECTS_PATH directory.
        if not StorageConfig.PROJECTS_PATH in path:
            Logger.log_error(f"[StorageManager] Path is not inside the projects directory: {path}")
            return False
        
        # Check if about to delete windows system files.
        if path in ["C:\\", "C:\\Windows", "C:\\Program Files", "C:\\Program Files (x86)"]:
            Logger.log_error(f"[StorageManager] Attempted to delete system files: {path}")
            return False
        
        shutil.rmtree(path)
    
    def get_file_paths(self, project_id):
        # Get the list of file names in the project directory.
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id))
        filenames = os.listdir(path)
        return [os.path.join(StorageConfig.FILES_HEADER_BASE_PATH, str(project_id), filename) for filename in filenames]

    def create_file(self, project_id, name):
        # Check if the file already exists.
        file_list = os.listdir(os.path.join(StorageConfig.PROJECTS_PATH, str(project_id)))
        file_num = len([file for file in file_list if name in file])
        if file_num > 0:
            name = f"{name} ({file_num})"
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), name)
        with open(path, "wb") as file:
            file.write(b"")

        return os.path.join(StorageConfig.FILES_HEADER_BASE_PATH, str(project_id), name)

