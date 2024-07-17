from pymongo import MongoClient


class Database:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Database, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.client = MongoClient('mongo', 27017)
            self.db = self.client['TaskManagerDB']
            self.loans_collection = self.db['users']
            self.initialized = True
    
database = Database()