import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await authService.forgotPassword(email);

      console.log("Forgot Password Response:", response);

      setMessage(
        response?.message ||
          "If an account exists with this email, a password reset link will be sent."
      );
    } catch (error) {
      console.error("Forgot Password Error:", error);
      console.error("Server Response:", error.response?.data);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>AI Career Recommendation</h1>

        <h2>Forgot Password</h2>

        <p className="forgot-password-description">
          Enter your registered email address and we'll
          send you a secure password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link →"}
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <button
          type="button"
          className="login-button"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;