import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ showLogin, setShowLogin, setShowSignUp, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowLogin(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", email, password);

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      const { token, user, redirectUrl } = res.data;

      if (token && user && redirectUrl) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user); 
        setMessage("Login successful!");

        setTimeout(() => {
          setShowLogin(false);
          resetForm();
          navigate(redirectUrl);
        }, 2000);
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setMessage("Login failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal show={showLogin} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button variant="danger" type="submit" className="mt-3 w-100">
            Login
          </Button>

          <p className="mt-3 text-center text-danger">{message}</p>

          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <span
              className="text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowLogin(false);
                setShowSignUp(true);
              }}
            >
              Sign up here
            </span>
          </p>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginForm;
