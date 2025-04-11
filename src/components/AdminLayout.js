import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminHomePage.css";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false); // close sidebar on navigation (for mobile)
  };

  return (
    <div className="admin-dashboard">
      <div className="mobile-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h2 className="mobile-title">Admin Panel</h2>
      </div>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Admin Actions</h2>
        <ul>
          <li onClick={() => handleNavigation("/admin/reports")}>Download Reports</li>
          <li onClick={() => handleNavigation("/admin/add-marketplace")}>Add Marketplace</li>
          <li onClick={() => handleNavigation("/admin/add-course")}>Add Course</li>
          <li onClick={() => handleNavigation("/login")}>Log Out</li>
        </ul>
      </aside>

      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
