import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">Institute Admin</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/blog"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">📝</span>
          Blog
        </NavLink>

        <NavLink
          to="/admin/new-batch"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">🎓</span>
          New Batch
        </NavLink>

        <NavLink
          to="/admin/contact"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">📞</span>
          Contact
        </NavLink>

        {/* <NavLink
          to="/admin/about"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">ℹ️</span>
          About Us
        </NavLink> */}

        <NavLink
          to="/admin/placement"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">💼</span>
          Placement
        </NavLink>

        <NavLink
          to="/admin/career"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">🚀</span>
          Career
        </NavLink>

        <NavLink
          to="/admin/applied"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">👨‍🎓</span> {/* 🔹 Updated icon */}
          Applied Students
        </NavLink>

        <NavLink
          to="/admin/enquiry"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="icon">❓</span>
          Enquiry
        </NavLink>

       <NavLink
  to="/admin/video-reviews"
  className={({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link"
  }
>
  <span className="icon">🎥</span>
  Video Reviews
</NavLink>

<NavLink
  to="/admin/text-reviews"
  className={({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link"
  }
>
  <span className="icon">⭐</span>
  Text Reviews
</NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
