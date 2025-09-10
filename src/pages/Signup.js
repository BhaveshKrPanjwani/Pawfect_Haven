// src/pages/Signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth(); // Get the signup function from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Client-side validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields must be filled out");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    // Basic email format check (more robust regex can be used)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setLoading(true);
    const result = await signup(fullName, email, password);
    setLoading(false);

    if (result.success) {
      alert("Sign Up Successful!");
      navigate("/"); // Redirect to home or a dashboard page
    } else {
      setError(result.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="sign-up_body">
      <div className="background-sign"></div>
      <div className="form-container">
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
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          <div className="terms">
            <input type="checkbox" id="terms" required disabled={loading} />
            <label htmlFor="terms">I agree to the Terms and Conditions</label>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;