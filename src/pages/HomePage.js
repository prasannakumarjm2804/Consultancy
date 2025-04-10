import React from "react";
import { useEffect, useState } from "react";
import "../styles/HomePage.css"; // Custom styles
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";

import indexImage from "../images/home.png"; // Import your image
const HomePage = () => {
    const [animate, setAnimate] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
     const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
      setTimeout(() => setAnimate(true), 500); // Delay animation start
    }, []);
  
  return (
    <div className="home-container">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side - Text Content */}
          <div className={`col-md-6 text-content ${animate ? "slide-in" : ""}`}>
            <h1 className="title">
              Discover <br />
              Perfect <span className="highlight">Style!</span>
            </h1>
            <p className="subtitle">Elevate Your Wardrobe with Elegance</p>
            <p className="description">
              Step into a world of fashion and sophistication. Explore our latest
              collections and find the perfect outfit for every occasion. Shop now
              and enjoy an exclusive{" "}
              <span className="discount">30% off</span> on your first purchase!
            </p><br />
            <div className={ showSignUp || showLogin ? "blur-background" : ""}>
              <button className="signup-btn" onClick={() => setShowSignUp(true)}>
                  <i className="fa fa-user-plus"></i> Sign Up
              </button>
            </div>
            <SignUpForm showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowLogin={setShowLogin} />
            <LoginForm showLogin={showLogin} setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
          </div>

          {/* Right Side - Image */}
          <div className="col-md-6">
          <div className={`image-container ${animate ? "zoom-circle" : ""}`}>
              <img src={indexImage} alt="Fruits" className="dress-image" />
              <div className="floating-leaf"></div>
              <div className="floating-leaf leaf2"></div>
              <div className="floating-leaf leaf3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
