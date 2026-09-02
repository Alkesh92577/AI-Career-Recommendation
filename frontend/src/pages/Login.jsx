import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const response = await authService.login(formData);

      console.log("Login Response:", response);


      if (response.success) {

        // ====================================
        // SAVE USER INFORMATION
        // ====================================

        localStorage.setItem(
          "userId",
          response.userId
        );

        localStorage.setItem(
          "userName",
          response.name
        );

        localStorage.setItem(
          "userEmail",
          response.email
        );

        localStorage.setItem(
          "userRole",
          response.role
        );


        setMessage(
          "Login successful!"
        );


        console.log(
          "User ID:",
          response.userId
        );

        console.log(
          "User Name:",
          response.name
        );


        // ====================================
        // GO TO DASHBOARD
        // ====================================

        setTimeout(() => {

          navigate("/dashboard");

        }, 700);


      } else {

        setMessage(
          response.message ||
          "Login failed"
        );

      }

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>
          AI Career Recommendation
        </h1>

        <h2>
          Welcome Back
        </h2>


        <form onSubmit={handleSubmit}>


          {/* EMAIL */}

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
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword
                ? "◉"
                : "◌"}

            </button>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Signing In..."
              : "Sign In →"}

          </button>


        </form>


        {/* MESSAGE */}

        {message && (

          <p className="message">

            {message}

          </p>

        )}


        <p>
          Don't have an account?
        </p>


        {/* REGISTER */}

        <button
          className="login-button"
          onClick={() =>
            navigate("/register")
          }
        >

          Create New Account →

        </button>

      </div>

    </div>

  );

}

export default Login;