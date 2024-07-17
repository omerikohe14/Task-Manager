from flask import Flask, request
from flask_cors import CORS
import tasksMangment

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def home():
    return "The Backend Server is runing!"

@app.route('/signup',methods=['POST'])
def signup():
    input = request.get_json()
    response,status = tasksMangment.signup(input)
    return response,status

@app.route('/login',methods=['POST'])
def login():
    input = request.get_json()
    response,status = tasksMangment.login(input)
    return response,status

@app.route('/add_tasks',methods=['POST'])
def add_task():
    input = request.get_json()
    response,status = tasksMangment.add_task(input)
    return response,status

@app.route('/delete_tasks',methods=['POST'])
def delete_task():
    input = request.get_json()
    response,status = tasksMangment.delete_task(input)
    return response,status

@app.route('/edit_tasks',methods=['POST'])
def edit_task():
    input = request.get_json()
    response,status = tasksMangment.edit_task(input)
    return response,status

if __name__ == '__main__':  
    app.run(port= 5000, debug=True, host= "127.0.0.1")
