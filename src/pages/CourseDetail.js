import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserDetailsPopup from "./UserDetailsPopup"; 
import "../styles/CourseDetail.css"; 
import axios from "axios";

const CourseDetail = () => {
  const { userId, courseId } = useParams(); 
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [showModal, setShow] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch((err) => console.log(err));
  }, [courseId]);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      fetch(`http://localhost:5000/courses/user/${courseId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.hasBought) setIsUnlocked(true);
        })
        .catch((err) => console.log(err));
    }
  }, [courseId]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log("⚠️ No token found. User might not be logged in.");
      setShow(true);
      return;
    }
  
    console.log("🔑 Sending Token:", token);  // Debugging token
    
    try {
      const response = await axios.post("http://localhost:5000/enroll", 
        { courseId }, 
        { headers: { Authorization: `Bearer ${token}` } }  // Correct format
      );
  
      console.log("✅ Enrollment response:", response.data);
      alert(response.data.message);
      setIsUnlocked(true);
    } catch (error) {
      console.error("❌ Enrollment failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Enrollment failed. Please try again.");
    }
  };
  
  const handleLogin = () => {
    console.log("Login triggered");
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-detail-container">
      <h4>{course.title}</h4>
      <p style={{ color: "gray", fontSize: "14px" }}>Recorded classes • {course.category}</p>

      <div className="media-tags">
        <span className="tag">📚PDFS</span>
        <span className="tag">💻VIDEOS</span>
      </div>

      <div className="course_detail_content">
        <div className="overview-content">
          <h3>About This Course</h3>
          <p>{course.description}</p>
          <p>AVAILABLE OFFLINE - RECORDED CLASS</p>

          <div className="course-features">
            <div className="feature">
              <i className="fa fa-clock-o"></i>
              <p>Lifetime Access</p>
              <p>Buy once and access whenever you want. No holding your learnings back.</p>
            </div>
            <div className="feature">
              <i className="fa fa-play-circle"></i>
              <p>3 Learning Materials</p>
              <p>2 Files, 1 Video lecture</p>
            </div>
          </div>
          <br/>

          <h3>Content to be Covered</h3>
          <ul>
            {Array.isArray(course.contentToBeCovered) ? (
              course.contentToBeCovered.map((content, index) => (
                <li key={index} style={{ lineHeight: "42px" }}>{content}</li>
              ))
            ) : (
              <li>No content available</li>
            )}
          </ul>
        </div>

        <div className="pricing-section">
          <img src={course.image} alt={course.title} /><br /><br />
          <h5>{course.title}</h5>
          <p>₹ {course.price}</p>

          <div className={showModal ? "blur-background" : ""}> 
            <button className="buy-button" onClick={handleEnroll}>
              Get this course
            </button>
          </div>
        </div>
      </div>

      <div className="course-creator-section">
        <h3>About Course Creator</h3>
        <p>{course.instructor}</p>
        <p>Teacher by Profession</p>
        <p>10000+ Students • 80 Courses</p>
      </div>

      <div className="materials-tab">
        <h3>Course Materials</h3>
        {isUnlocked ? (
          <div>
            <h4>📚 PDFs</h4>
            <ul>
              {course.pdfs.map((pdf, index) => (
                <li key={index}><a href={pdf} target="_blank" rel="noopener noreferrer">PDF {index + 1}</a></li>
              ))}
            </ul>
            <h4>💻 Videos</h4>
            <ul>
              {course.videos.map((video, index) => (
                <li key={index}><a href={video} target="_blank" rel="noopener noreferrer">Video {index + 1}</a></li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p>Materials are locked. Please unlock to access.</p>
            <button onClick={handleEnroll}>Unlock Materials</button>
          </div>
        )}
      </div>

      <UserDetailsPopup showModal={showModal} setShow={setShow} onLogin={handleLogin} />
    </div>
  );
};

export default CourseDetail;
