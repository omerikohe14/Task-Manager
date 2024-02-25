import pymongo
import json
from flask import jsonify
import api_keys
import uuid


def signup(data):
    client,users_collection = mongodb_collection_setup()
    user=data['username']
    password=data['password']
    # Check whether user exists
    user_exist = users_collection.find_one({"username": user, "password": password})
    if user_exist:
        return jsonify({"error": "User already exists"})
    # If user does not exist, create a new user
    new_user = {
                "username": user,
                "password": password,
                "Tasks": []
    }
    users_collection.insert_one(new_user)
    client.close()
    return jsonify({"success": "User created successfully"}),200

def login(data):
    client,users_collection = mongodb_collection_setup()
    user=data['username']
    password=data['password']
    # Check whether user exists
    exist_user = users_collection.find_one({"username": user})
    if not exist_user:
        return jsonify({"error": "User does not exist"})
    # If user exists, check whether password is correct
    if exist_user.get('password') != password:
        return jsonify({"error": "Password is incorrect"})
    exist_user["_id"] = str(exist_user["_id"])
    json_user = json.dumps(exist_user)
    client.close()
    return json_user, 200
    
def add_task(data):
    client, users_collection = mongodb_collection_setup()
    username = data['username']
    password = data['password']
    task = data['task']
    user_exist = users_collection.find_one({"username": username, "password": password})
    if not user_exist:
        return jsonify({"error": "User does not exist"})
    task_data = {
        "task_id": str(uuid.uuid4()),
        "title": task['title'],
        "completed": task['completed']
    }
    users_collection.update_one({"username": username}, 
                                {"$push": {"Tasks": task_data}})
    client.close()
    return jsonify({"newtask": task_data }), 200

def delete_task(data):
    client, users_collection = mongodb_collection_setup()
    username = data['username']
    password = data['password']
    task = data['task']
    user_exist = users_collection.find_one({"username": username , "password": password})
    if not user_exist:
        print("the current user not exist")
        return jsonify({"error": "User does not exist"})
    task_data = {
        "task_id": task['task_id'],
        "title": task['title'],
        "completed": task['completed']
    }
    if task_data in user_exist['Tasks']:
        users_collection.update_one({"username": username}, {"$pull": {"Tasks": task_data}})
    client.close()  
    return jsonify({"Deleted task": task_data}), 200

def edit_task(data):
    client, users_collection = mongodb_collection_setup()
    username = data['username']
    password = data['password']
    task = data['task']
    user_exist = users_collection.find_one({"username": username, "password": password})
    if not user_exist:
        return jsonify({"error": "User does not exist"})
    task_data = {
        "task_id": task['task_id'],
        "title": task['title'],
        "completed": task['completed']
    }
    updated_tasklist = [temp_task for temp_task in user_exist['Tasks'] 
                        if temp_task['task_id'] != task_data['task_id']]
    updated_tasklist.append(task_data)
    users_collection.update_one({"username": username}, {"$set": {"Tasks": updated_tasklist}})
    client.close()
    return jsonify({"editTask": task_data }), 200

def mongodb_collection_setup():
    connection_string = api_keys.mongoDB_key
    db_name = "usersDB"
    collection_name = "users"
    client = pymongo.MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]
    return client, collection