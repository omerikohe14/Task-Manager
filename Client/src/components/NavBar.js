import './styles/navbar.css'
import { Link } from "react-router-dom";

const Navbar = ({ userInfo, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="headline">Task Manager</Link>
      <div className="links">
        {userInfo ? (
          <div className="userinfo">
            <button onClick={onLogout} style={{
              color: 'white',
              backgroundColor: '#0056b3',
              borderRadius: '4px'
            }}>Logout</button>

          </div>
        ) : (
          <div className="guestInfo">
            <Link to="/login" style={{
              color: 'white',
              backgroundColor: '#0056b3',
              borderRadius: '4px'
            }}>Log-in</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;