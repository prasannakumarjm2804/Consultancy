import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import LoginForm from "./LoginForm"; // Import LoginForm component

const Navbar = ({ user, setUser }) => {
  const [showLogin, setShowLogin] = useState(false); // State to control login form visibility
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); // Redirect to homepage after logout
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser); // Update user state
    navigate(`/${storedUser.id}/home`); // Redirect to homepage with user ID after successful login
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <span className="fw-bold" style={{ color: "#D32F2F" }}>AMBIKA'S</span>&nbsp;
            <span className="fw-bold" style={{ color: "#FFA000" }}>BOUTIQUE</span>
            <span style={{ color: "#4CAF50", marginLeft: "5px" }}>👗</span>
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link text-dark" to={user ? `/${user.id}/home` : "/"}>Home</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark" to={user ? `/${user.id}/courses` : "/courses"}>Courses</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark" to={user ? `/${user.id}/about` : "/about"}>About</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark" to={user ? `/${user.id}/shop` : "/shop"}>Shop</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark" to={user ? `/${user.id}/contacts` : "/contacts"}>Contacts</Link></li>
              
              {/* Cart Icon */}
              <li className="nav-item">
                <Link className="nav-link text-dark" to={user ? `/${user.id}/cart` : "/cart"}>
                  <i className="fa fa-shopping-cart"></i>
                </Link>
              </li>

              {/* Show Profile if Logged In */}
              {user ? (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-danger" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown">
                    <i className="fa fa-user-circle"></i> {user.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to={`/${user.id}/dashboard`}>Dashboard</Link></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <span className="nav-link text-dark" style={{ cursor: "pointer" }} onClick={() => setShowLogin(true)}>
                    <i className="fa fa-user"></i> Login
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <LoginForm showLogin={showLogin} setShowLogin={setShowLogin} onLoginSuccess={handleLoginSuccess} setUser={setUser} />
    </>
  );
};

export default Navbar;
