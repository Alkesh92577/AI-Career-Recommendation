import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/authService";

function ResetPassword() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    if (!token) {
      setMessage(
        "Invalid password reset link."
      );
      return;
    }

    if (newPassword.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {

      const response =
        await authService.resetPassword(
          token,
          newPassword
        );

      if (response.success) {

        setMessage(
          response.message ||
          "Password reset successful."
        );

        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1800);

      } else {

        setMessage(
          response.message ||
          "Password reset failed."
        );
      }

    } catch (error) {

      console.error(
        "Reset Password Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to reset password. Please request a new reset link."
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          AI Career Recommendation
        </h1>

        <h2>
          Reset Password
        </h2>

        <p className="forgot-password-description">
          Create a new password for your account.
        </p>

        {!token ? (

          <>
            <p className="message">
              This password reset link is invalid.
            </p>

            <button
              type="button"
              className="login-button"
              onClick={() =>
                navigate("/forgot-password")
              }
            >
              Request New Link →
            </button>
          </>

        ) : (

          <form onSubmit={handleSubmit}>

            {/* NEW PASSWORD */}

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
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
                {showPassword ? "◉" : "◌"}
              </button>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="password-wrapper">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword
                  ? "◉"
                  : "◌"}
              </button>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Reset Password →"}
            </button>

          </form>
        )}


        {message && token && (
          <p className="message">
            {message}
          </p>
        )}


        <button
          type="button"
          className="login-button"
          onClick={() =>
            navigate("/login")
          }
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

export default ResetPassword;