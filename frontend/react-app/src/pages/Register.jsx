import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:8000/shop/api/register/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/login");
    } else {
      setError(data.error);
    }
  };

  return (
    <main className="register-page">
      {/* Background decorative lights */}
      <div className="register-glow glow-one"></div>
      <div className="register-glow glow-two"></div>

      {/* Small background stars */}
      <div className="register-stars"></div>

      <section className="register-wrapper">
        {/* Top icon */}
        <div className="register-logo">
          <span>✦</span>
        </div>

        {/* Heading */}
        <header className="register-heading">
          <h1>Alacena</h1>

          <p>
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </header>

        {/* Registration card */}
        <div className="register-card">
          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleRegister}>
            {/* Names */}
            <div className="register-name-row">
              <div className="register-field">
                <label>First Name</label>

                <input
                  type="text"
                  placeholder="Ali Ahmed"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="register-field">
                <label>Last Name</label>

                <input
                  type="text"
                  placeholder="Shaikh"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="register-field">
              <label>Email</label>

              <input
                type="email"
                placeholder="ada@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="register-field">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm password */}
            <div className="register-field">
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {/* Register button */}
            <button type="submit" className="register-button">
              Create Account
              <span>→</span>
            </button>
          </form>

          <p className="register-footer">
            By creating an account, you agree to our
            <span>Terms</span>
            and
            <span>Privacy Policy</span>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
