import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      className="global-home-button"
      onClick={() => navigate("/dashboard")}
    >
      ⌂
      <span>
        Home
      </span>
    </button>
  );
}

export default HomeButton;