import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard =
    location.pathname === "/dashboard";

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const goHome = () => {
    navigate("/dashboard");
    closeSidebar();
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: "⌂",
      label: "Dashboard",
      section: "MAIN",
    },
    {
      path: "/profile",
      icon: "👤",
      label: "My Profile",
      section: "MY PROFILE",
    },
    {
      path: "/academic-details",
      icon: "🎓",
      label: "Academic Details",
      section: "MY PROFILE",
    },
    {
      path: "/skills",
      icon: "◆",
      label: "Skills",
      section: "MY PROFILE",
    },
    {
      path: "/interest-assessment",
      icon: "🧠",
      label: "Interest Test",
      section: "MY PROFILE",
    },
    {
      path: "/skill-assessment",
      icon: "📊",
      label: "Skill Assessment",
      section: "MY PROFILE",
    },
    {
      path: "/ai-prediction",
      icon: "✦",
      label: "AI Prediction",
      section: "MY PROFILE",
    },
    {
      path: "/career-roadmap",
      icon: "🛣",
      label: "Career Roadmap",
      section: "MY PROFILE",
    },
    {
      path: "/courses",
      icon: "▤",
      label: "Recommended Courses",
      section: "RESOURCES",
    },
    {
      path: "/career-report",
      icon: "📄",
      label: "Report",
      section: "RESOURCES",
    },
  ];

  const sections = [
    "MAIN",
    "MY PROFILE",
    "RESOURCES",
  ];

  return (
    <div className="app-layout">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-icon">
            ✦
          </div>

          <div className="sidebar-logo-text">

            <h2>
              CareerAI
            </h2>

            <p>
              Career Assistant
            </p>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          {sections.map((section) => (

            <div
              className="nav-section"
              key={section}
            >

              <p className="nav-section-title">
                {section}
              </p>

              {menuItems
                .filter(
                  (item) =>
                    item.section === section
                )
                .map((item) => (

                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `nav-item ${
                        isActive
                          ? "nav-item-active"
                          : ""
                      }`
                    }
                  >

                    <span className="nav-icon">
                      {item.icon}
                    </span>

                    <span className="nav-label">
                      {item.label}
                    </span>

                  </NavLink>

                ))}

            </div>

          ))}

        </nav>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={() => {
            closeSidebar();
            navigate("/login");
          }}
        >

          <span>
            ↪
          </span>

          Logout

        </button>

      </aside>

      {/* MAIN APPLICATION */}

      <div className="app-main">

        {/* MOBILE HEADER */}

        <header className="mobile-app-header">

          {/* HAMBURGER */}

          <button
            className="mobile-menu-btn"
            onClick={() =>
              setSidebarOpen(
                (previous) => !previous
              )
            }
            aria-label="Open navigation menu"
          >

            <span />

            <span />

            <span />

          </button>

          {/* APP BRAND */}

          <div className="mobile-app-brand">

            <span className="brand-star">
              ✦
            </span>

            <span className="brand-name">
              CareerAI
            </span>

          </div>

          {/* HOME BUTTON
              Dashboard पर intentionally hidden
          */}

          {!isDashboard ? (

            <button
              className="mobile-home-btn"
              onClick={goHome}
              aria-label="Go to Dashboard"
            >

              <span className="mobile-home-icon">
                ⌂
              </span>

              <span className="mobile-home-text">
                Home
              </span>

            </button>

          ) : (

            <div className="mobile-header-space" />

          )}

        </header>

        {/* PAGE CONTENT */}

        <main className="page-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default Layout;