import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css'
import LogIn from './Login'
import SignUp from './Signup';
import Home from './Home';
import TaskManager from './Tasks';
import NavBar from './NavBar';
import { useState } from 'react';

function App() {

  const [userInfo, setUserInfo] = useState();
  const handleLogin = (userData) => {
    setUserInfo(userData);
    }
  const handleLogout = () => {
    setUserInfo(null);
  }

  return (
    <Router>
      <div className="App">
          <NavBar userInfo={userInfo} onLogout={handleLogout}/>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/Login" element={<LogIn onLogin={handleLogin}/>}/>
            <Route path="/Signup" element={<SignUp />}/>
            <Route path="/Tasks" element={<TaskManager userInfo={userInfo}/>}/>
          </Routes>
      </div>
    </Router>
  );
}
export default App;