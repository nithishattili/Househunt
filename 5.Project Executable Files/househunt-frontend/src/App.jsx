// src/App.jsx – modern layout with Navbar & Tailwind
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Protected from "./pages/Protected.jsx";
import PropertyList from "./pages/PropertyList.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import MyBookings from "./pages/MyBookings.jsx";
function App() {
  return (
    <>
      {/* Global navigation bar */}
      <Navbar />

      {/* Main content area */}
      <main className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
