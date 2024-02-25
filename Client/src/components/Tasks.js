import React, { useState, useEffect } from "react";
import "../styles/Tasks.css";
import TaskModal from "./TaskModal";
import { add_tasks_url, delete_tasks_url, edit_tasks_url } from "./ServerURLs";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Tasks = ({ userInfo }) => {
  const [modal, setModal] = useState(false);
  const [viewCompleted, setViewCompleted] = useState(false);
  const [tasklist, setTaskList] = useState([]);
  const [activetask, setActivetask] = useState({
    title: "",
    completed: false,
    task_id: "",
  });
  const [editedTask, setEditedTask] = useState(null);

  useEffect(() => {
    userInfo ? setTaskList(userInfo.Tasks) : setTaskList([]);
  }, [userInfo]);
  
  const toggleModal = () => {
    if (modal) {
      setEditedTask(null);
    }
    setModal(!modal);
  };

  const createNewTask = () => {
    setActivetask({ title: "", completed: false});
    toggleModal();
  };

  const handleAddSubmit = (newtask) => {
    if (newtask.title.trim() !== "") {
      const currentTask = {username: userInfo.username,
                           password: userInfo.password,
                           task: newtask}               
      axios.post(add_tasks_url,currentTask)
      .then((response) => {
          if(response.status !== 200){
            throw new Error(response.status);
          }
        const temptask = response.data.newtask;
        const updatedTaskList = [...tasklist, temptask];
        setTaskList(updatedTaskList);
        userInfo.Tasks = updatedTaskList;
        toggleModal()
        })};
  };

  const handleEdit = (editTask) => {
    setActivetask({ ...editTask, task_id: editTask.task_id });
    setEditedTask(editTask);
    toggleModal();
  };

  const handleEditSubmit = (updatedtask) => {
    const currentTask = {username: userInfo.username,
                         password: userInfo.password,
                         task: updatedtask}
    axios.post(edit_tasks_url, currentTask)
    .then((response) => {
    if(response.status !== 200){
      throw new Error(response.status);
    }
    const updatedTaskList = tasklist.map((task) =>
      task.task_id === updatedtask.task_id ? updatedtask : task
    );
    setTaskList(updatedTaskList);
    userInfo.Tasks = updatedTaskList;
    setEditedTask(null);
    })
    .catch(err => {
      console.log(err)
    })
  };

  const handleSubmit = (input_task) => {  
    if (editedTask) {
      handleEditSubmit(input_task);
    } else {
      handleAddSubmit(input_task);
    }
  };
  
  const handleCompletedToggle = (task) => {
    const updatedTaskList = tasklist.map((t) =>
      t.task_id === task.task_id ? { ...t, completed: !t.completed } : t
    );
    const currentTask = { username: userInfo.username,
                          password: userInfo.password, 
                          task: { ...task, completed: !task.completed } };

    axios.post(edit_tasks_url, currentTask)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.status);
        }
        setTaskList(updatedTaskList);
        userInfo.Tasks = updatedTaskList;
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };
    
  const handleDelete = (task_to_delete) => {
    const currentTask = {username: userInfo.username,
                         password: userInfo.password,
                         task: task_to_delete}
    axios.post(delete_tasks_url, currentTask)
   .then((response) => {
        if(response.status !== 200){
            throw new Error(response.status);
        }
    const updatedTaskList = tasklist.filter((task) => task !== task_to_delete);
    setTaskList(updatedTaskList);
    userInfo.Tasks = updatedTaskList;
    })
    .catch(err => {
      console.log(err)
    })
  };

  const displayCompleted = (status) => {
    setViewCompleted(status);
  };

  const renderTabList = () => {
    return (
      <div className="tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  const renderTasks = () => {  
    const newTasksList = tasklist.filter(task => task.completed === viewCompleted);
    return newTasksList.map((task) => (
      <li key={task.task_id} className="list">
        <div>
          <span
            className={`${viewCompleted ? "completed-task" : ""}`}>
            {task.title}
          </span>
        </div>
        <div className="buttons">
        { <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleCompletedToggle(task)}
          /> }
        <button className="edit" onClick={() => handleEdit(task)}>
          Edit
        </button>
        <button className="delete" onClick={() => handleDelete(task)}>
          Delete
        </button>
        </div>
      </li>
    ));
  };

  return (
    userInfo ? 
      <div className="home">
      <div className="welcome"> Welcome {userInfo.username}</div>
      <div>
        <button className="addtask" onClick={createNewTask}>
          Add Task
        </button>
      </div>
      {renderTabList()}
      <ul className="list-group list-group-flush">{renderTasks()}</ul>
      {modal && (
        <TaskModal
          activeTask={activetask}
          toggle={toggleModal}
          onSave={handleSubmit}
        />
      )}
    </div>
    : <Navigate to="/" />
  );
};

export default Tasks;
