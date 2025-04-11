import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const SignUpForm = ({ showSignUp, setShowSignUp, setShowLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setOtpSent(false);
    setMessage("");
  };

  const handleClose = () => {
    setShowSignUp(false);
    resetForm();
  };

  const sendOTP = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:5000/send-otp", {
        name,
        email,
        password,
      });
  
      setOtpSent(true);
      setMessage(res.data.message); // Success message
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error); // Display backend error message
      } else {
        setMessage("Error sending OTP. Please try again.");
      }
    }
  };
  

  // **Verify OTP**
  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setMessage(res.data.message);
      const token = res.data.token; // ✅ Get JWT token from response

    if (token) {
      localStorage.setItem("token", token); // ✅ Store token
      
    }

      if (res.data.message.includes("successfully")) {
        setTimeout(() => {
          setShowSignUp(false);
          setShowLogin(true);
          resetForm();
        }, 2000);
      }
    } catch (error) {
      setMessage("Invalid or expired OTP.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Modal show={showSignUp} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={otpSent ? verifyOTP : sendOTP}>
          {!otpSent ? (
            <>
              <Form.Group controlId="username">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

              <Form.Group controlId="email" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

              <Form.Group controlId="confirmPassword" className="mt-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <InputGroup.Text onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Button variant="danger" type="submit" className="mt-3 w-100">
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <Form.Group controlId="otp">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </Form.Group>

              <Button variant="success" type="submit" className="mt-3 w-100">
                Verify OTP
              </Button>
            </>
          )}

          <p className="mt-3 text-center text-danger">{message}</p>

          <p className="mt-3 text-center">
            Already have an account?{" "}
            <span className="text-danger" style={{ cursor: "pointer" }} onClick={() => { setShowSignUp(false); setShowLogin(true); }}>
              Login here
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

export default SignUpForm;
