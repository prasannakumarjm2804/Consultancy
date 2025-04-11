import React, { useState } from "react";
import axios from "axios";
import "../styles/AddCoursePage.css"; 
import AdminLayout from "../components/AdminLayout";

const AddCoursePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    instructor: "",
    image: "",
    videos: [],
    pdfs: [],
    contentToBeCovered: [],
    course_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "videos" || name === "pdfs" || name === "contentToBeCovered") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 

      const res = await axios.post(
        "http://localhost:5000/courses",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course added successfully!");
      setFormData({
        title: "",
        description: "",
        price: "",
        instructor: "",
        image: "",
        videos: [],
        pdfs: [],
        contentToBeCovered: [],
        course_id: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add course");
    }
  };

  return (
    <AdminLayout>
    <div className="add-course-container">
      <h1>Add New Course</h1>
      <form onSubmit={handleSubmit}>
        <label>Course Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Instructor Name</label>
        <input type="text" name="instructor" value={formData.instructor} onChange={handleChange} required />

        <label>Course Image URL</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} required />

        <label>Video URLs (comma separated)</label>
        <input type="text" name="videos" value={formData.videos.join(", ")} onChange={handleChange} />

        <label>PDF URLs (comma separated)</label>
        <input type="text" name="pdfs" value={formData.pdfs.join(", ")} onChange={handleChange} />

        <label>Content to be Covered (comma separated)</label>
        <input type="text" name="contentToBeCovered" value={formData.contentToBeCovered.join(", ")} onChange={handleChange} />

        <label>Course ID</label>
        <input type="text" name="course_id" value={formData.course_id} onChange={handleChange} required />

        <button type="submit">Add Course</button>
      </form>
    </div>
    </AdminLayout>
  );
};

export default AddCoursePage;
