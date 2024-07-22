from pymongo import MongoClient
from urllib.parse import quote_plus

class Database:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Database, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'initialized'):
            username = quote_plus('omerheldenberg')
            password = quote_plus('odxlt7xnNigCLjT9')
            uri = f'mongodb+srv://{username}:{password}@cluster0.iccgxdm.mongodb.net/TaskManagerDB?retryWrites=true&w=majority'
            self.client = MongoClient(uri)
            self.db = self.client['TaskManagerDB']
            self.users_collection = self.db['users'] 
            self.initialized = True

    def find_one(self, query):
        return self.users_collection.find_one(query)

    def insert_one(self, data):
        return self.users_collection.insert_one(data)

    def update_one(self, query, update):
        return self.users_collection.update_one(query, update)

database = Database()
