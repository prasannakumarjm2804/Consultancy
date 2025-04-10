import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import "../styles/Contact.css";

const Contact = () => {
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email",
    appointmentType: "",
    preferredDate: ""
  });
  
  // State management
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('message'); // 'message' or 'appointment'
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Refs for scroll animations
  const mapRef = useRef(null);
  const ctaRef = useRef(null);
  const isMapInView = useInView(mapRef, { once: true, amount: 0.3 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  
  const mapControls = useAnimation();
  const ctaControls = useAnimation();
  
  // Appointment types
  const appointmentTypes = [
    { id: 'styling', name: 'Personal Styling', icon: 'styling-icon', duration: '60 min' },
    { id: 'tailoring', name: 'Custom Tailoring', icon: 'tailoring-icon', duration: '45 min' },
    { id: 'bridal', name: 'Bridal Consultation', icon: 'bridal-icon', duration: '90 min' },
    { id: 'wardrobe', name: 'Wardrobe Analysis', icon: 'wardrobe-icon', duration: '120 min' }
  ];

  // Handle animations based on scroll position
  useEffect(() => {
    if (isMapInView) {
      mapControls.start('visible');
    }
    if (isCtaInView) {
      ctaControls.start('visible');
    }
  }, [isMapInView, isCtaInView, mapControls, ctaControls]);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAppointmentTypeSelect = (typeId) => {
    setFormData({
      ...formData,
      appointmentType: typeId
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    
    if (formData.phone && !/^[0-9+-\s()]{10,15}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (activeTab === 'message' && !formData.message.trim()) {
      errors.message = "Message is required";
    }
    
    if (activeTab === 'appointment') {
      if (!formData.appointmentType) {
        errors.appointmentType = "Please select an appointment type";
      }
      
      if (!formData.preferredDate) {
        errors.preferredDate = "Please select a preferred date";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would normally send the form data to a server
      console.log("Form submitted:", formData);
      
      // Show success message
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email",
        appointmentType: "",
        preferredDate: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Map and CTA animations
  const mapVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8 
      }
    }
  };
  
  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };
  
  // Get current date and format it for the date input min attribute
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    
    // Add leading zeros if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="contact-page">
      {/* Decorative background elements */}
      <div className="decorative-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="tech-lines"></div>
      </div>
      
      {/* Hero Section */}
      <motion.div 
        className="contact-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <div className="contact-subtitle">
            <span className="highlight">Experience</span> the future of fashion with Ambika's Boutique
          </div>
          <div className="hero-call-to-action">
            <a href="#contact-form" className="hero-button">Contact Us</a>
            <a href="#book-appointment" className="hero-button outline">Book Appointment</a>
          </div>
        </div>
        <div className="scrolldown-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="arrows">
            <span className="arrow-down"></span>
            <span className="arrow-down"></span>
          </div>
        </div>
      </motion.div>
      
      <div id="contact-form" className="contact-content-wrapper">
        {/* Main content container */}
        <motion.div 
          className="contact-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side - Contact form */}
          <motion.div className="contact-form-section" variants={itemVariants}>
            <div className="contact-heading">
              <h2>Connect With Us</h2>
              <div className="heading-underline"></div>
            </div>
            
            <div className="contact-tabs">
              <button 
                className={`tab ${activeTab === 'message' ? 'active' : ''}`}
                onClick={() => setActiveTab('message')}
              >
                Send Message
              </button>
              <button 
                id="book-appointment"
                className={`tab ${activeTab === 'appointment' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointment')}
              >
                Schedule Appointment
              </button>
            </div>
            
            {isSubmitted && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="success-icon"></div>
                {activeTab === 'message' 
                  ? "Thank you for your message! We'll get back to you soon." 
                  : "Your appointment request has been received! We'll confirm shortly."}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <span className="label-text">Full Name</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={formErrors.name ? "error" : ""}
                  />
                  {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">
                    <span className="label-text">Email Address</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? "error" : ""}
                  />
                  {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className={formErrors.phone ? "error" : ""}
                  />
                  {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="preferredContact">
                    <span className="label-text">Preferred Contact Method</span>
                  </label>
                  <select
                    id="preferredContact"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>
              
              {activeTab === 'message' && (
                <>
                  <div className="form-group">
                    <label htmlFor="subject">
                      <span className="label-text">Subject</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="What is your inquiry about?"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">
                      <span className="label-text">Message</span>
                      <span className="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleChange}
                      className={formErrors.message ? "error" : ""}
                    ></textarea>
                    {formErrors.message && <div className="error-message">{formErrors.message}</div>}
                  </div>
                </>
              )}
              
              {activeTab === 'appointment' && (
                <>
                  <div className="form-group appointment-types">
                    <label>
                      <span className="label-text">Appointment Type</span>
                      <span className="required">*</span>
                    </label>
                    <div className="appointment-type-grid">
                      {appointmentTypes.map(type => (
                        <div 
                          key={type.id}
                          className={`appointment-type-card ${formData.appointmentType === type.id ? 'selected' : ''}`}
                          onClick={() => handleAppointmentTypeSelect(type.id)}
                        >
                          <div className={`appointment-icon ${type.icon}`}></div>
                          <h4>{type.name}</h4>
                          <div className="duration">{type.duration}</div>
                        </div>
                      ))}
                    </div>
                    {formErrors.appointmentType && <div className="error-message">{formErrors.appointmentType}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="preferredDate">
                      <span className="label-text">Preferred Date</span>
                      <span className="required">*</span>
                    </label>
                    <div className="date-input-wrapper">
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        min={getCurrentDate()}
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className={formErrors.preferredDate ? "error" : ""}
                      />
                      <div className="calendar-icon"></div>
                    </div>
                    {formErrors.preferredDate && <div className="error-message">{formErrors.preferredDate}</div>}
                  </div>
                </>
              )}
              
              <div className="form-footer">
                <motion.button 
                  type="submit" 
                  className="submit-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {activeTab === 'message' ? 'Send Message' : 'Request Appointment'}
                </motion.button>
                <div className="privacy-notice">
                  By submitting this form, you agree to our <a href="#">Privacy Policy</a>
                </div>
              </div>
            </form>
          </motion.div>
          
          {/* Right side - Contact info & map */}
          <motion.div className="contact-info-section" variants={itemVariants}>
            <div className="contact-heading">
              <h2>Boutique Information</h2>
              <div className="heading-underline"></div>
            </div>
            
            <div className="info-card">
              <div className="info-item">
                <div className="info-icon location-icon"></div>
                <div className="info-content">
                  <h3>Premium Boutique Location</h3>
                  <p>123 Fashion Avenue, Suite 500</p>
                  <p>Luxury District, NY 10001</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon email-icon"></div>
                <div className="info-content">
                  <h3>Email Correspondence</h3>
                  <p>clientcare@ambikasboutique.com</p>
                  <p>appointments@ambikasboutique.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon phone-icon"></div>
                <div className="info-content">
                  <h3>Contact Numbers</h3>
                  <p>Main: +1 (212) 555-7890</p>
                  <p>VIP Line: +1 (212) 555-7891</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon time-icon"></div>
                <div className="info-content">
                  <h3>Atelier Hours</h3>
                  <div className="hours-table">
                    <div className="hours-row">
                      <span>Monday - Friday</span>
                      <span>10:00 AM - 7:00 PM</span>
                    </div>
                    <div className="hours-row">
                      <span>Saturday</span>
                      <span>10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="hours-row">
                      <span>Sunday</span>
                      <span>By Appointment Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <h3>Connect With Our Community</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon facebook">
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon instagram">
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon twitter">
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="social-icon pinterest">
                  <span className="sr-only">Pinterest</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon linkedin">
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
            
            <div className="professional-badges">
              <div className="badge">
                <div className="badge-icon premium"></div>
                <span>Premium Tailoring</span>
              </div>
              <div className="badge">
                <div className="badge-icon sustainable"></div>
                <span>Sustainable Fashion</span>
              </div>
              <div className="badge">
                <div className="badge-icon exclusive"></div>
                <span>Exclusive Designs</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Map section */}
        <motion.div 
          ref={mapRef}
          className="map-section"
          variants={mapVariants}
          initial="hidden"
          animate={mapControls}
        >
          <div className="section-header">
            <h2>Visit Our Boutique</h2>
            <div className="section-line"></div>
          </div>
          <div className="map-container">
            {!mapLoaded ? (
              <div className="map-loading">
                <div className="loading-spinner"></div>
                <p>Loading interactive map...</p>
              </div>
            ) : (
              <div className="map-placeholder">
                <div className="map-pin"></div>
                <div className="map-card">
                  <h3>Ambika's Boutique</h3>
                  <p>123 Fashion Avenue, Suite 500<br/>Luxury District, NY 10001</p>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="directions-button">
                    Get Directions
                  </a>
                </div>
                <div className="map-overlay"></div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Appointment CTA */}
        <motion.div 
          ref={ctaRef}
          className="appointment-cta"
          variants={ctaVariants}
          initial="hidden"
          animate={ctaControls}
        >
          <div className="cta-overlay"></div>
          <div className="cta-content">
            <h2>Experience Personalized Fashion Consultation</h2>
            <p>Book a private appointment with one of our expert stylists for a bespoke fashion experience tailored to your unique style and preferences.</p>
            <div className="cta-buttons">
              <motion.button 
                className="cta-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveTab('appointment');
                  document.getElementById('book-appointment').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Appointment
              </motion.button>
              <motion.button 
                className="cta-button secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
          <div className="cta-accent-shape"></div>
        </motion.div>
      </div>
      
      {/* Client testimonial */}
      <div className="mini-testimonial">
        <div className="quote-icon"></div>
        <blockquote>
          "Ambika's Boutique transformed my wardrobe and confidence with their exceptional service and stunning designs."
        </blockquote>
        <div className="testimonial-author">
          <div className="author-image"></div>
          <div className="author-info">
            <div className="author-name">Elizabeth Miller</div>
            <div className="author-title">Fashion Editor, Vogue</div>
          </div>
        </div>
      </div>
      
      {/* Signature */}
      <div className="designer-signature">
        <div className="signature-line"></div>
        <p>Ambika Patel</p>
        <span>Founder & Creative Director</span>
        <div className="signature-line"></div>
      </div>
    </div>
  );
};

export default Contact;
