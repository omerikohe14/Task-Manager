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

  useEffect(() => {
    userInfo ? setTaskList(userInfo.Tasks) : setTaskList([]);
  }, [userInfo]
  );
  
  const toggleModal = () => {
    setModal(!modal);
  };

  const handleSubmit = (updatedtask) => {  
    if (updatedtask.title.trim() !== "") {
    const currentTask = {username: userInfo.username,
                         password: userInfo.password,
                         task: updatedtask}
    axios.post(add_tasks_url,currentTask)
      .then((response) => {
          if(response.status !== 200){
              throw new Error(response.status);
          }
        setTaskList([...tasklist, updatedtask]);
        userInfo.Tasks = [...tasklist, updatedtask];
        toggleModal()
      })};
  }
  const handleDelete = (tasktodelete) => {
    const currentTask = {username: userInfo.username,
                         password: userInfo.password,
                         task: tasktodelete}
    axios.post(delete_tasks_url, currentTask)
   .then((response) => {
        if(response.status !== 200){
            throw new Error(response.status);
        } 
    const updatedTaskList = tasklist.filter((task) => task !== tasktodelete);
    setTaskList(updatedTaskList);
    userInfo.Tasks = updatedTaskList;
  })
  .catch(err => {
    console.log(err)
  })
  };

  const createNewTask = () => {
      setActivetask({ title: "", completed: false});
      toggleModal();
  };
  
  const handleEdit = (task) => {
    toggleModal();
    const currentTask = {username: userInfo.username,
                         password: userInfo.password,
                         task: task}
    axios.post(edit_tasks_url, currentTask)
    .then((response) => {
         if(response.status !== 200){
             throw new Error(response.status);
         } 
    const updatedTaskList = tasklist.filter((task) => task !== task);
    setTaskList(updatedTaskList);
    userInfo.Tasks = updatedTaskList;
 
   })
   .catch(err => {
     console.log(err)
   })
  };

    const handleCompletedToggle = (task) => {
      const updatedTaskList = tasklist.map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
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
    const newTasksList = tasklist.filter((task) => task.completed === viewCompleted);
    return newTasksList.map((task) => (
      <li key={task.id} className="list">
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
