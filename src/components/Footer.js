import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>Welcome to Ambika's Boutique! We are dedicated to providing the best tailoring and fashion services. Our team of experienced professionals is here to help you look your best.</p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/contacts">Contacts</a></li>
            </ul>
          </div>
          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>Email: support@amikasboutique.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: 123 Fashion Street, Tailoring City, TX 12345</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Ambika's Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
