import React, { useState, useEffect } from "react";
import "../styles/About.css";
import { motion } from "framer-motion";

const About = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [visible, setVisible] = useState(false);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const statsElement = document.querySelector('.stats-section');
      if (statsElement) {
        const position = statsElement.getBoundingClientRect();
        if (position.top < window.innerHeight && !visible) {
          setVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const timer1 = setInterval(() => {
        setCount1(prev => {
          const next = prev + 1;
          if (next >= 500) clearInterval(timer1);
          return next > 500 ? 500 : next;
        });
      }, 10);

      const timer2 = setInterval(() => {
        setCount2(prev => {
          const next = prev + 1;
          if (next >= 50) clearInterval(timer2);
          return next > 50 ? 50 : next;
        });
      }, 60);

      const timer3 = setInterval(() => {
        setCount3(prev => {
          const next = prev + 1;
          if (next >= 12) clearInterval(timer3);
          return next > 12 ? 12 : next;
        });
      }, 200);

      return () => {
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
      };
    }
  }, [visible]);

  const services = [
    {
      id: 1,
      title: "Custom Tailoring",
      description: "Bespoke garments crafted to your exact measurements and style preferences."
    },
    {
      id: 2,
      title: "Bridal Collections",
      description: "Stunning wedding attire that captures your unique style and vision."
    },
    {
      id: 3,
      title: "Alterations",
      description: "Expert garment alterations to ensure the perfect fit for your existing wardrobe."
    },
    {
      id: 4,
      title: "Fashion Consulting",
      description: "Professional styling advice tailored to your body type, coloring, and lifestyle."
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section with Parallax */}
      <motion.div 
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="decorative-elements">
          <motion.div 
            className="floating-element elem1"
            animate={{
              y: [0, 15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="floating-element elem2"
            animate={{
              y: [0, -20, 0],
              rotate: [0, -8, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="floating-element elem3"
            animate={{
              y: [0, 10, 0],
              rotate: [0, 3, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>
        <div className="about-hero-content">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Ambika's Boutique
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Crafting Elegance Since 2025
          </motion.p>
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
          >
            <span>Scroll to explore</span>
            <div className="mouse"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Introduction Banner */}
      <motion.div 
        className="intro-banner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p>Welcome to a world where fashion meets tradition, and elegance embraces innovation.</p>
      </motion.div>

      {/* Our Story Section - Enhanced */}
      <motion.section 
        className="about-section story-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-section-container">
          <div className="about-section-text">
            <h2>Our Story</h2>
            <div className="story-highlight">Established 2025</div>
            <p>Founded in 2025, Ambika's Boutique started with a simple vision - to create stunning, personalized fashion that celebrates individual style and cultural heritage.</p>
            <p>What began as a small tailoring shop has evolved into a premier fashion destination, known for our exquisite craftsmanship and attention to detail.</p>
            <p>Our journey reflects our unwavering commitment to quality and our passion for bringing our clients' fashion dreams to life. From bridal couture to everyday elegance, we offer comprehensive fashion solutions tailored to your unique style preferences.</p>
            <p>Every garment that leaves our boutique tells a story - of tradition, of innovation, and of the meticulous care invested in its creation.</p>
            
            <div className="services-preview">
              <h3>Our Services</h3>
              <div className="services-grid">
                {services.map(service => (
                  <motion.div 
                    key={service.id}
                    className={`service-item ${activeService === service.id ? 'active' : ''}`}
                    onMouseEnter={() => setActiveService(service.id)}
                    onMouseLeave={() => setActiveService(null)}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                    }}
                  >
                    <h4>{service.title}</h4>
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: activeService === service.id ? 1 : 0,
                        height: activeService === service.id ? 'auto' : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.description}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="story-milestones">
              <div className="milestone">
                <div className="milestone-year">2025</div>
                <div className="milestone-text">Grand Opening</div>
              </div>
              <div className="milestone">
                <div className="milestone-year">2026</div>
                <div className="milestone-text">First Collection</div>
              </div>
              <div className="milestone">
                <div className="milestone-year">2028</div>
                <div className="milestone-text">Online Expansion</div>
              </div>
            </div>
            <div className="signature">Ambika Patel, Founder</div>
          </div>
          <div className="about-section-image story-image">
            <div className="image-overlay">
              <span>Since 2025</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Our Mission Section - Enhanced */}
      <motion.section 
        className="about-section mission-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="about-section-container reverse">
          <div className="about-section-image mission-image">
            <div className="image-tag">
              <span>Artistry + Innovation</span>
            </div>
          </div>
          <div className="about-section-text">
            <h2>Our Mission</h2>
            <p>At Ambika's Boutique, our mission is to empower through fashion. We believe that the perfect outfit does more than just look good—it builds confidence and allows authentic self-expression.</p>
            <p>We are dedicated to creating garments that blend traditional craftsmanship with contemporary design, offering a unique fashion experience that honors both heritage and innovation.</p>
            <p>Every stitch reflects our commitment to excellence and our desire to exceed our clients' expectations.</p>
            <div className="mission-highlights">
              <div className="highlight-box">
                <h4>Vision</h4>
                <p>To become the most trusted name in personalized fashion, creating experiences that transform how people feel about themselves.</p>
              </div>
              <div className="highlight-box">
                <h4>Promise</h4>
                <p>Exquisite craftsmanship, impeccable fit, and attention to detail in every garment we create.</p>
              </div>
            </div>
            <div className="mission-bullets">
              <div className="mission-bullet">
                <span className="bullet-icon">✧</span>
                <span className="bullet-text">Celebrating individuality through personalized fashion</span>
              </div>
              <div className="mission-bullet">
                <span className="bullet-icon">✧</span>
                <span className="bullet-text">Preserving traditional techniques while embracing innovation</span>
              </div>
              <div className="mission-bullet">
                <span className="bullet-icon">✧</span>
                <span className="bullet-text">Creating sustainable fashion with ethical practices</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{count1}+</div>
            <div className="stat-label">Satisfied Clients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{count2}+</div>
            <div className="stat-label">Custom Designs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{count3}</div>
            <div className="stat-label">Fashion Awards</div>
          </div>
        </div>
      </motion.section>

      {/* Our Values Section */}
      <motion.section 
        className="about-section values-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="values-title">Our Core Values</h2>
        <div className="values-container">
          <motion.div 
            className="value-card"
            whileHover={{ y: -15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="value-icon quality-icon"></div>
            <h3>Quality Craftsmanship</h3>
            <p>We believe in creating garments that stand the test of time, both in style and durability.</p>
            <div className="value-detail">Every piece we create passes through rigorous quality checks at multiple stages of production.</div>
          </motion.div>
          <motion.div 
            className="value-card"
            whileHover={{ y: -15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="value-icon personalization-icon"></div>
            <h3>Personalized Service</h3>
            <p>We treat each client as unique, tailoring our approach to their individual needs and preferences.</p>
            <div className="value-detail">Our designers take time to understand your style, body type, and preferences to create the perfect look.</div>
          </motion.div>
          <motion.div 
            className="value-card"
            whileHover={{ y: -15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="value-icon innovation-icon"></div>
            <h3>Innovative Design</h3>
            <p>We continuously explore new techniques and trends to offer fresh, contemporary fashion.</p>
            <div className="value-detail">Our team regularly attends global fashion events to bring the latest trends and techniques to our boutique.</div>
          </motion.div>
          <motion.div 
            className="value-card"
            whileHover={{ y: -15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="value-icon sustainability-icon"></div>
            <h3>Sustainable Practices</h3>
            <p>We are committed to responsible fashion that respects both people and the environment.</p>
            <div className="value-detail">We source eco-friendly fabrics and ensure ethical manufacturing practices throughout our supply chain.</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Customer Testimonial Section */}
      <motion.section 
        className="about-section testimonial-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2>What Our Clients Say</h2>
        <div className="testimonial-subtitle">Real experiences from our valued customers</div>
        <div className="testimonial-container">
          <motion.div 
            className="testimonial"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p>"Ambika's Boutique transformed my vision into the most beautiful outfit I've ever worn. Their attention to detail is unmatched, and the compliments I received were endless!"</p>
            <div className="testimonial-author">- Priya S.</div>
            <div className="testimonial-rating">★★★★★</div>
            <div className="testimonial-event">Wedding Collection, 2026</div>
          </motion.div>
          <motion.div 
            className="testimonial"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p>"The team at Ambika's understands fashion on a different level. They don't just create clothes; they create experiences. My wedding lehenga was beyond perfect!"</p>
            <div className="testimonial-author">- Rahul M.</div>
            <div className="testimonial-rating">★★★★★</div>
            <div className="testimonial-event">Bridal Couture, 2027</div>
          </motion.div>
          <motion.div 
            className="testimonial"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p>"I've never felt more confident than when wearing a custom-designed outfit from Ambika's. Their ability to enhance your best features is remarkable."</p>
            <div className="testimonial-author">- Ananya K.</div>
            <div className="testimonial-rating">★★★★★</div>
            <div className="testimonial-event">Festive Collection, 2028</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="team-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Meet Our Team</h2>
        <div className="team-subtitle">The creative minds behind our designs</div>
        <div className="team-container">
          <div className="team-member">
            <div className="team-photo founder-photo"></div>
            <h3>Ambika Patel</h3>
            <p className="team-role">Founder & Creative Director</p>
            <p className="team-bio">With over 15 years of experience in haute couture and a degree from a prestigious fashion institute, Ambika brings her unique vision and expertise to every design.</p>
          </div>
          <div className="team-member">
            <div className="team-photo designer-photo"></div>
            <h3>Ravi Sharma</h3>
            <p className="team-role">Lead Designer</p>
            <p className="team-bio">Specializing in innovative pattern-making and contemporary silhouettes, Ravi infuses traditional designs with modern elements.</p>
          </div>
          <div className="team-member">
            <div className="team-photo tailor-photo"></div>
            <h3>Lakshmi Nair</h3>
            <p className="team-role">Master Tailor</p>
            <p className="team-bio">With her exceptional skill and meticulous attention to detail, Lakshmi ensures that every garment meets our exacting standards of quality.</p>
          </div>
        </div>
      </motion.section>

      {/* Visit Us Section */}
      <motion.section 
        className="about-section visit-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2>Visit Our Boutique</h2>
        <div className="visit-subtitle">Experience our personalized service in person</div>
        <div className="visit-content">
          <div className="visit-info">
            <p><strong>Address:</strong> 123 Fashion Avenue, Style District</p>
            <p><strong>Hours:</strong> Monday-Saturday: 10am-7pm, Sunday: 11am-5pm</p>
            <p><strong>Contact:</strong> +1 (555) 123-4567 | info@ambikasboutique.com</p>
          </div>
          <motion.button 
            className="contact-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </div>
        <div className="social-links">
          <a href="https://instagram.com" className="social-link">Instagram</a>
          <a href="https://facebook.com" className="social-link">Facebook</a>
          <a href="https://pinterest.com" className="social-link">Pinterest</a>
        </div>
      </motion.section>

    </div>
  );
};

export default About;
