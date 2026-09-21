import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

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
      await sendPasswordResetEmail(auth, email.trim());

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
    } catch (error) {
      console.error("Firebase Forgot Password Error:", error);

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
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