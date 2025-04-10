import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/ReportsPage.css";
import AdminLayout from "../components/AdminLayout";

const reports = [
  {
    title: "Courses Registered",
    description: "Track all user registrations for courses.",
    icon: "📚",
    color: "report-blue",
    path: "/admin/reports/courses"
  },
  {
    title: "Products Sold",
    description: "Sales and revenue analytics of products.",
    icon: "🛒",
    color: "report-green",
    path: "/admin/reports/products-sold"
  },
  {
    title: "Products in Stock",
    description: "Current inventory and stock level insights.",
    icon: "📦",
    color: "report-orange",
    path: "/admin/reports/products-stock"
  },
  {
    title: "Best Design Chosen",
    description: "Top-rated designs picked by the users.",
    icon: "🎨",
    color: "report-yellow",
    path: "/admin/reports/best-design"
  },
  {
    title: "Other Reports",
    description: "Additional platform reports and metrics.",
    icon: "📊",
    color: "report-purple",
    path: "/admin/reports/others"
  },
];

const ReportsPage = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <AdminLayout>
      <div className="reports-container">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Admin Reports Dashboard
        </motion.h1>

        <div className="reports-grid">
          {reports.map((report, idx) => (
            <motion.div
              key={idx}
              className={`report-card ${report.color}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
            >
              <div className="report-icon">{report.icon}</div>
              <h3>{report.title}</h3>
              <p>{report.description}</p>
              <button onClick={() => handleRedirect(report.path)}>Generate</button>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
