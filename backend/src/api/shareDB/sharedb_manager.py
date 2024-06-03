import pymongo
from constants import ShareDBConfig


class ShareDBManager():
    __instance = None

    def __init__(self):
        self.db = pymongo.MongoClient("mongodb://localhost:27017/")["shareDB"]
    
    @staticmethod
    def get_instance():
        if not ShareDBManager.__instance:
            ShareDBManager.__instance = ShareDBManager()
        return ShareDBManager.__instance
    
    def read_file(self, project_id, file_name):
        # Get a document by collection and document id
        document_id = ShareDBConfig.ID_HEADER + file_name   
        document = self.db[str(project_id)].find_one({"_id": document_id})
        return document["content"] if document else None
    
    def delete_project(self, project_id):
        # Drop the collection
        self.db.drop_collection(str(project_id))

    def delete_file(self, project_id, file_name):
        # Delete a document by collection and document id
        document_id = ShareDBConfig.ID_HEADER + file_name
        self.db[str(project_id)].delete_one({"_id": document_id})

    def rename_file(self, project_id, file_name, new_file_name):
        # Get the old document data
        document_id = ShareDBConfig.ID_HEADER + file_name
        document = self.db[str(project_id)].find_one({"_id": document_id})
        
        # Remove the _id field from the document
        document.pop("_id")

        # Delete the old document
        self.delete_file(project_id, file_name)

        # Insert the new document
        document_id = ShareDBConfig.ID_HEADER + new_file_name
        document["_id"] = document_id

        self.db[str(project_id)].insert_one(document)


        

