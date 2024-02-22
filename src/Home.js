import React from 'react';
import './styles/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import task_manager from './task manager.jpg';

function Home() {
  const navigate = useNavigate();
  const handleLoginClick = () => {navigate('/Login');};
  const handleSignupClick = () => {navigate('/Signup');};
  return (
    <div className="Home">
      <h1>Welcome to your Task Manager.
        <br/>
        Please Login or Signup to continue.
      </h1>
      <Link to="/Login">
        <button onClick={handleLoginClick}>Login</button>
      </Link>
      <Link to="/Signup">
        <button onClick={handleSignupClick}>Signup</button>
      </Link>
      <img src={task_manager} alt='Task manager'/>
    </div>
    );
  }
export default Home;
