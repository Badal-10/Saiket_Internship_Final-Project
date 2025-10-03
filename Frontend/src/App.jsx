import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Footer from "./Components/Footer";


const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inactivityTimeoutRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    navigate("/", { replace: true });
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = setTimeout(() => {
      logout();
    }, 60 * 60 * 1000); // 1 hour inactivity timeout
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000; // current time in seconds

        if (decoded.exp && decoded.exp < now) {
          // token expired → force logout
          logout();
        } else {
          // Setup inactivity timer
          resetInactivityTimeout();

          // Setup event listeners to reset inactivity timer on user activity
          const events = ["mousemove", "keydown", "mousedown", "touchstart"];
          events.forEach((event) => window.addEventListener(event, resetInactivityTimeout));

          return () => {
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
            events.forEach((event) => window.removeEventListener(event, resetInactivityTimeout));
          };
        }
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Route protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Logged in: prevent access to login/signup, redirect to dashboard
      if (location.pathname === "/login" || location.pathname === "/signup") {
        navigate("/dashboard", { replace: true });
      }
    } else {
      // Not logged in: prevent access to dashboard, redirect to login
      if (location.pathname === "/dashboard") {
        navigate("/login", { replace: true });
      }
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />

      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
