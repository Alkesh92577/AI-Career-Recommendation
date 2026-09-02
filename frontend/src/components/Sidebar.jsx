import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="dashboard-logo">

          <div className="logo-icon">
            🚀
          </div>

          <div>
            <h2>CareerAI</h2>
            <span>Career Assistant</span>
          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="dashboard-nav">

          {/* MAIN */}
          <div className="nav-section-title">
            MAIN
          </div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>⌂</span>
            Dashboard
          </NavLink>


          {/* =================================================
              MY PROFILE
          ================================================= */}

          <div className="nav-section-title">
            MY PROFILE
          </div>


          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>◉</span>
            My Profile
          </NavLink>


          <NavLink
            to="/academic-details"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>◉</span>
            Academic Details
          </NavLink>


          <NavLink
            to="/skills"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>◉</span>
            Skills
          </NavLink>


          <NavLink
            to="/interest-assessment"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🧠</span>
            Interest Test
          </NavLink>


          {/* =================================================
              ASSESSMENT
          ================================================= */}

          <div className="nav-section-title">
            ASSESSMENT
          </div>


          <NavLink
            to="/skill-assessment"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>📊</span>
            Skill Assessment
          </NavLink>


          <NavLink
            to="/ai-prediction"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>✦</span>
            AI Prediction
          </NavLink>


          <NavLink
            to="/career-roadmap"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🗺️</span>
            Career Roadmap
          </NavLink>


          {/* =================================================
              RESOURCES
          ================================================= */}

          <div className="nav-section-title">
            RESOURCES
          </div>


          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>▤</span>
            Recommended Courses
          </NavLink>
              

          <NavLink
            to="/report"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>📄</span>
            Report
          </NavLink>

        </nav>


        {/* =====================================================
            SIDEBAR BOTTOM
        ===================================================== */}

        <div className="sidebar-bottom">

          {/* LOGOUT */}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;