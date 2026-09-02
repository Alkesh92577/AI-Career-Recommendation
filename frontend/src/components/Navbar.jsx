import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-title">
        AI Career Recommendation
      </div>

      <div className="navbar-user">

        <div>
          👤 {email || "Student"}
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;