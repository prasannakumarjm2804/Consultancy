import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]); // Ensure courses is always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL if available

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/courses");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        if (userId) {
          const token = localStorage.getItem('token');
          if (token) {
            const userRes = await fetch(`http://localhost:5000/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const userData = await userRes.json();
            if (userData && userData.courses) {
              const boughtCourses = userData.courses.map(course => course._id);
              const filteredCourses = data.filter(course => !boughtCourses.includes(course._id));
              setCourses(filteredCourses);
            } else {
              setCourses(data);
            }
          } else {
            setCourses(data);
          }
        } else {
          setCourses(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setCourses([]); // Ensure courses is always an array
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleBuyCourse = (courseId) => {
    navigate(`/${userId ? userId : ''}/courses/${courseId}`);
  };

  if (loading) return <p>Loading courses...</p>; // Show loading state
  if (error) return <p>Error: {error}</p>; // Show error message
  if (!courses || courses.length === 0) return <p>No courses available</p>; // Handle empty courses

  return (
    <div>
      <h3><b>Premier Courses for You - Elite Choices</b></h3>
      <div className="course-container">
        {courses.map((course) => (
          <div
            key={course._id}
            className="course-card"
            onClick={() => handleBuyCourse(course._id)} // Navigate to course detail page
          >
            <img src={course.image} alt={course.title} />
            <div className="course_tags">
              {course.tags && course.tags.map((tag, index) => (
                <span key={index} className="course_tag">{tag}</span>
              ))}
            </div>
            <p className="course_title">{course.title}</p>
            <p>₹ {course.price}</p>
            <button className="buy-button">Get this course</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
