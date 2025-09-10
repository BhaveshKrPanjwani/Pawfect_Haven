// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Get the login function from context
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    // Client-side validation
    if (!email || !password) {
      setError("Email and password must be filled out");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      alert("Login Successful!");
      navigate("/"); // Redirect to home or dashboard
    } else {
      setError(result.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-area">
        <div className="logo-img">
          <img
            src={process.env.PUBLIC_URL+"/util/logo.jpeg"}
            alt="Pawfect Haven Logo"
          />
        </div>
        <div className="logo">
          <h1>Pawfect Haven</h1>
        </div>
      </div>
      <h1>Welcome Back!</h1>
      <form onSubmit={handleSubmit}>
        <span className="outer-text">Email</span> {/* Changed Username to Email */}
        <input
          type="email"
          id="email"
          name="email" // Changed from "fname" to "email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <span className="outer-text">Password</span>
        <input
          type="password"
          id="password"
          name="pass"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
        {/* <div className="social-login">
          <p>Or login with</p>
          <div className="icons">
            <button className="social-btn">
              <img
                src={process.env.PUBLIC_URL+"/util/google-mail-icon-logo-isolated-on-transparent-background-free-vector.jpg"}
                alt="Google"
              />
            </button>
            <button className="social-btn">
              <img src={process.env.PUBLIC_URL+"/util/facebook-logo.png" }alt="Facebook" />
            </button>
            <button className="social-btn">
              <img src={process.env.PUBLIC_URL+"/util/ig-logo.jpg" }alt="Instagram" />
            </button>
            <button className="social-btn">
              <img src={process.env.PUBLIC_URL+"/util/x-logo.webp" }alt="Twitter" />
            </button>
          </div>
        </div> */}
      </form>

      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;