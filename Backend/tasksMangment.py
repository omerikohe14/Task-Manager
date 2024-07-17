import pymongo
import json
from flask import jsonify
import api_keys
import uuid
from database import database


def signup(data):
    user=data['username']
    password=data['password']
    # Check whether user exists
    user_exist = database.find_one({"username": user, "password": password})
    if user_exist:
        return jsonify({"error": "User already exists"})
    # If user does not exist, create a new user
    new_user = {
                "username": user,
                "password": password,
                "Tasks": []
    }
    database.insert_one(new_user)
    return jsonify({"success": "User created successfully"}),200

def login(data):
    user=data['username']
    password=data['password']
    # Check whether user exists
    exist_user = database.find_one({"username": user})
    if not exist_user:
        return jsonify({"error": "User does not exist"}) , 404
    # If user exists, check whether password is correct
    if exist_user.get('password') != password:
        return jsonify({"error": "Password is incorrect"})
    exist_user["_id"] = str(exist_user["_id"])
    json_user = json.dumps(exist_user)
    return json_user, 200
    
def add_task(data):
    username = data['username']
    password = data['password']
    task = data['task']
    user_exist = database.find_one({"username": username, "password": password})
    if not user_exist:
        return jsonify({"error": "User does not exist"}), 404
    task_data = {
        "task_id": str(uuid.uuid4()),
        "title": task['title'],
        "completed": task['completed']
    }
    database.update_one({"username": username}, 
                                {"$push": {"Tasks": task_data}})
    return jsonify({"newtask": task_data }), 200

def delete_task(data):
    username = data['username']
    password = data['password']
    task = data['task']
    user_exist = database.find_one({"username": username , "password": password})
    if not user_exist:
        print("the current user not exist")
        return jsonify({"error": "User does not exist"})
    task_data = {
        "task_id": task['task_id'],
        "title": task['title'],
        "completed": task['completed']
    }
    if task_data in user_exist['Tasks']:
        database.update_one({"username": username}, {"$pull": {"Tasks": task_data}})
    return jsonify({"Deleted task": task_data}), 200

def edit_task(data):
    username = data['username']
    password = data['password']
    task = data['task']
    user_exist = database.find_one({"username": username, "password": password})
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
    database.update_one({"username": username}, {"$set": {"Tasks": updated_tasklist}})
    return jsonify({"editTask": task_data }), 200

