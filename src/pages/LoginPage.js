import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });
      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem("authToken", token);

      // Check if the user is an admin
      const adminCheckResponse = await axios.post("http://localhost:5000/check", { email, password });
      if (adminCheckResponse.data.isAdmin) {
        navigate("/admin-homepage"); // Redirect to admin homepage
      } else {
        navigate("/user-homepage"); // Redirect to normal user homepage
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
