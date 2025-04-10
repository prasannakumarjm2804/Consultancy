import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/AdminHomePage.css";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-section">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="profile-img"/>
          <h3>Ambika's Boutique</h3>
        </div>
        <ul className="sidebar-options">
          <li onClick={() => handleNavigation("/admin/profile")}>
            <i className="fa fa-user"></i> Profile
          </li>
          <li onClick={handleLogout}>
            <i className="fa fa-sign-out"></i> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <h1>Admin Actions</h1>
        <div className="dashboard-actions">
          <motion.div
            className="action-card"
            onClick={() => handleNavigation("/admin/reports")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Download Reports</h3>
            <p>Generate and download reports for analysis.</p>
          </motion.div>

          <motion.div
            className="action-card"
            onClick={() => handleNavigation("/admin/add-marketplace")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Add Marketplace</h3>
            <p>Add new items to the marketplace.</p>
          </motion.div>

          <motion.div
            className="action-card"
            onClick={() => handleNavigation("/admin/add-course")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Add Course</h3>
            <p>Create and manage new courses.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminHomePage;
