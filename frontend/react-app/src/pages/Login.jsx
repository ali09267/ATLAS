import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import "../styles/Login.css";

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    document.cookie.split(";").forEach((cookie) => {
      cookie = cookie.trim();

      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
      }
    });
  }

  return cookieValue;
}

function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const res = await fetch("http://localhost:8000/shop/api/login/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "X-CSRFToken": getCookie("csrftoken"),
        },

        credentials: "include",

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        login(data);

        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <main className="login-page">
      {/* Decorative background */}
      <div className="login-glow login-glow-one"></div>

      <div className="login-glow login-glow-two"></div>

      <div className="login-stars"></div>

      <section className="login-wrapper">
        {/* Alacena icon */}
        <div className="login-logo">
          <span>A</span>
        </div>

        {/* Heading */}
        <header className="login-heading">
          <h1>Welcome Back</h1>

          <p>
            Sign in to continue your
            <span>Alacena</span>
            journey
          </p>
        </header>

        {/* Login card */}
        <div className="login-card">
          {error && (
            <div className="login-error">
              <span>!</span>

              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="login-field">
              <label>Email Address</label>

              <div className="login-input-box">
                <span className="login-input-icon">✉</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label>Password</label>

                <a
                  href="#"
                  className="forgot-password"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>

              <div className="login-input-box">
                <span className="login-input-icon">🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Login button */}
            <button type="submit" className="login-button">
              Sign In
              <span>→</span>
            </button>
          </form>

          {/* Register link */}
          <div className="login-divider">
            <span>New to Alacena?</span>
          </div>

          <p className="login-register-text">
            Create an account and start exploring
            <Link to="/register">Create Account</Link>
          </p>
        </div>

        <p className="login-security-text">
          <span>✦</span>
          Secure access to your ATLAS account
        </p>
      </section>
    </main>
  );
}

export default Login;
