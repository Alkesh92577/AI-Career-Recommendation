import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const response = await authService.register(formData);

      console.log("Backend Response:", response);

      if (response.success) {

        setMessage("Registration successful!");

        setTimeout(() => {
          navigate("/login");
        }, 1000);

      } else {

        setMessage(response.message || "Registration failed");

      }

    } catch (error) {

      console.error("Registration Error:", error);

      if (error.response) {

        setMessage(
          error.response.data?.message ||
          "Registration failed"
        );

      } else {

        setMessage(
          "Unable to connect to the backend.."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="register-page">

      <div className="register-box">

        <h1>AI Career Recommendation</h1>

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <div className="password-wrapper">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "◉" : "◌"}
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create My Account →"}
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <p>
          Already have an account?
        </p>

        <button
          className="login-button"
          onClick={() => navigate("/login")}
        >
          Sign In →
        </button>

      </div>

    </div>
  );
}

export default Register;