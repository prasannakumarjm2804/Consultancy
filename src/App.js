import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import UserDetailsPopup from "./pages/UserDetailsPopup";
import LoginForm from "./components/LoginForm";
import AdminHomePage from "./pages/AdminHomePage";
import ReportsPage from "./pages/ReportsPage";
import AddCoursePage from "./pages/AddCoursePage";
import AddMarketplacePage from "./pages/AddMarketplacePage";
import CourseReport from "./pages/CourseReport";
import FeedbackReport from "./pages/FeedbackReport";

import "./App.css";
import "./styles/Courses.css";

const AppContent = () => { 
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Check if the current path is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/userdetail" element={<UserDetailsPopup />} />
        <Route path="/:userId/home" element={<HomePage />} />
        <Route path="/:userId/courses" element={<Courses />} />
        <Route path="/:userId/courses/:courseId" element={<CourseDetail />} />
        <Route path="/:userId/about" element={<About />} />
        <Route path="/:userId/shop" element={<Shop />} />
        <Route path="/:userId/contacts" element={<Contact />} />
        <Route path="/:userId/cart" element={<Cart />} />
        <Route path="/:userId/dashboard" element={<HomePage />} />
        <Route path="/:userId/*" element={<Navigate to={`/${user ? user.id : ''}/home`} />} />
        <Route path="/admin-homepage" element={<AdminHomePage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/add-course" element={<AddCoursePage />} />
        <Route path="/admin/add-marketplace" element={<AddMarketplacePage />} />
        <Route path="/admin/reports/courses" element={<CourseReport />} />
        <Route path="/admin/reports/feedback" element={<FeedbackReport />} />
        
      </Routes>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <Chatbot />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
