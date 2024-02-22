import React, { useState, useEffect } from "react";
import "./styles/TaskModal.css";
const TaskModal = ({ activeTask, toggle, onSave }) => {
  const [currentTask, setCurrentTask] = useState(activeTask);

  useEffect(() => {
    setCurrentTask(activeTask);
  }, [activeTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedTask = {...currentTask, [name]: value };
    setCurrentTask(updatedTask);
  };

  const handleSave = () => {
    onSave(currentTask);
    toggle();
  };

  return (
    <div className="custom-modal">
      <div className="modal-overlay" onClick={toggle}></div>
        <div className="modal">
          <span className="modal-close" onClick={toggle}>X</span>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" name="title" value={currentTask.title} onChange={handleChange} />
            </div>
            <div className="form-group"/>
          </form>
        </div>
        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
  );
};

export default TaskModal;
