 import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <h3>Admin Panel</h3>
      </div>

      <div className="navbar-right">
        <div className="user-menu">
          <button className="user-btn">👤 Admin</button>
          <div className="dropdown-menu">
            <Link to="/admin/profile">Profile</Link>
            {/* <Link to="/admin/settings">Settings</Link> */}
            <hr />
            <Link to="/logout">Logout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;