from constants import StorageConfig
from utils import Logger
import json
import os
import shutil

class StorageManager():
    def __init__(self, **kwargs):
        pass

    def create_project(self, **kwargs):
        """ Create a new project directory. """
        id = kwargs.get("id")
        author = kwargs.get("author")
        name = kwargs.get("name")
        description = kwargs.get("description")

        path = os.path.join(StorageConfig.PROJECTS_PATH, str(id))
        os.mkdir(path)
        # Create the src directory.
        os.mkdir(os.path.join(path, "src"))
        self.update_metadata(path=path, id=id, author=author, name=name, description=description)
    
    def update_metadata(self, **kwargs):
        """ Update the metadata file of the project. """
        with open(os.path.join(StorageConfig.PROJECTS_PATH, str(kwargs["id"]), "metadata.json"), "wb") as file:
            metadata = {
                "id": kwargs["id"],
                "name": kwargs["name"],
                "description": kwargs["description"],
                "author": kwargs["author"]
            }
            file.write(json.dumps(metadata).encode("utf-8"))

    def get_metadata(self, project_id):
        """ Get the metadata of the project. """
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id))
        with open(os.path.join(path, "metadata.json"), "rb") as file:
            return json.load(file)
        
    def delete_project(self, project_id):
        """ Delete the project directory. """

        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id))
        shutil.rmtree(path) # Delete the project directory.
    
    def get_files(self, project_id):
        """ Get the list of files in the project directory. """
        # Get the list of file names in the project directory.
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src")
        filenames = os.listdir(path)
        # Send the list of files excluding the hidden files.
        return [file for file in filenames if file not in StorageConfig.HIDDEN_FILES]

    def create_file(self, project_id, name):
        """ Create a new file in the project directory. """
        # Check if the file already exists.
        file_list = os.listdir(os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src"))
        file_num = len([file for file in file_list if name in file])
        if file_num > 0:
            name = f"{name} ({file_num})" # Append a number to the file name.
        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src", name)
        with open(path, "wb") as file:
            file.write(b"")

        return True

    def edit_file_name(self, project_id, old_name, new_name):
        """ Edit the name of the file. """

        old_path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src", old_name)
        new_path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src", new_name)
        os.rename(old_path, new_path)
        return True
    
    def delete_file(self, project_id, name):
        """ Delete the file from the project directory. """

        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src", name)
        os.remove(path)
        return True
    
    def save_file(self, project_id, name, content):
        """ Save the content to the file. """

        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src", name)
        with open(path, "wb") as file:
            file.write(content.encode("utf-8"))
        return True
    
    def get_file(self, project_id, name):
        """ Get the content of the file. """

        path = os.path.join(StorageConfig.PROJECTS_PATH, str(project_id), "src", name)
        with open(path, "rb") as file:
            return file.read().decode("utf-8") 