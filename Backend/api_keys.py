import os

def get_key(api_key_name):
    key = os.getenv(api_key_name)
    if key is None:
        key = ""
    return key

mongoDB_key = get_key("MONGODB_URL")