import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import indexImage from "../images/home.png";
import axios from "axios";

const HomePage = () => {
  const [animate, setAnimate] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [user, setUser] = useState(null);
  const pastelColors = ["#FFEBEE", "#FFF3E0", "#E8F5E9", "#E3F2FD", "#F3E5F5", "#FCE4EC"];
  const randomColor = () => pastelColors[Math.floor(Math.random() * pastelColors.length)];





  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setFormData((prev) => ({
        ...prev,
        name: savedUser.name || "",
        email: savedUser.email || "",
        
      }));
    }
  
    fetchReviews();
    setTimeout(() => setAnimate(true), 500);
  }, []);
  

  const fetchReviews = () => {
    axios
      .get("http://localhost:5000/reviews")
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to fetch reviews", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/reviews", formData);
      setShowFeedbackForm(false);
      setFormData({ name: "", email: "", phone: "", topic: "", comment: "", rating: 0 });
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Error submitting review", err);
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side - Text */}
          <div className={`col-md-6 text-content ${animate ? "slide-in" : ""}`}>
            <h1 className="title">
              Discover <br />
              Perfect <span className="highlight">Style!</span>
            </h1>
            <p className="subtitle">Elevate Your Wardrobe with Elegance</p>
            <p className="description">
              Step into a world of fashion and sophistication. Explore our latest
              collections and find the perfect outfit for every occasion. Shop now
              and enjoy an exclusive <span className="discount">30% off</span> on your first purchase!
            </p>
            <br />
            <div className={showSignUp || showLogin ? "blur-background" : ""}>
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

        {/* Reviews Scrolling Section */}
        <div className="review-marquee-container">
          <div className="review-header">
            <h3>What People Say</h3>
            <button
              className="plus-icon"
              onClick={() => {
                if (!user) {
                  alert("Please sign in to leave a review!");
                  setShowLogin(true);
                  return;
                }
                setShowFeedbackForm(true);
              }}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>

          <div className="review-marquee">
            <div className="review-track">
              {reviews.map((review, index) => (
                <div
                  className="review-card"
                  key={index}
                  style={{ backgroundColor: randomColor() }}
                >
                  <div className="stars">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                  <strong>{review.name}</strong>:{" "}<br /><br />
                  {review.comment}
                </div>
              ))}
            </div>
          </div>
        </div>


          {/* Feedback Popup Form */}
        {showFeedbackForm && (
          <div className="feedback-popup">
            <form className="feedback-form" onSubmit={handleSubmit}>
              <h4>Share Your Feedback</h4>
              {/* <input type="text" placeholder="Name" value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="email" placeholder="Email" value={formData.email} required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              \ */}
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                readOnly
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              readOnly
            />

                <input type="tel" placeholder="Phone" value={formData.phone} required onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />      

                <select value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} required>
                  <option value="">Select Topic</option>
                  <option value="Course">Course</option>
                  <option value="MarketPlace">MarketPlace</option>
                <option value="Fabrics">Fabrics</option>
                <option value="Others">Others</option>
              </select>
              <textarea placeholder="Comment" value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} required />
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setFormData({ ...formData, rating: star })}>
                    {formData.rating >= star ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <div className="feedback-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowFeedbackForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
