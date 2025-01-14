import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Signup";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check token presence

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/signup" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

export default App;
