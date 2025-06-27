// src/components/Navbar.jsx
import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ─────────────────────────────────────────────────────────────
  //  Helpers
  // ─────────────────────────────────────────────────────────────
  const token = localStorage.getItem("token");

  /** Decode JWT payload safely (returns {} if token invalid) */
  const tokenPayload = useMemo(() => {
    if (!token) return {};
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return {};
    }
  }, [token]);

  const { role, status } = tokenPayload; // status = "pending" | "approved"

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /** Base link styling + active‐link highlight */
  const linkClass = (to) =>
    [
      "block md:inline-block px-3 py-2 rounded-md text-base md:text-sm font-medium transition",
      pathname === to
        ? "text-indigo-600 font-semibold"
        : "text-gray-700 hover:text-indigo-600",
    ].join(" ");

  // ─────────────────────────────────────────────────────────────
  //  Navigation links (commonLinks used for both desktop & mobile)
  // ─────────────────────────────────────────────────────────────
  const commonLinks = (
    <>
      {/* Home is always visible */}
      <Link to="/" className={linkClass("/")} onClick={() => setOpen(false)}>
        Home
      </Link>

      {/* Unauthenticated */}
      {!token && (
        <>
          <Link
            to="/login"
            className={linkClass("/login")}
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={linkClass("/register")}
            onClick={() => setOpen(false)}
          >
            Register
          </Link>
        </>
      )}

      {/* Authenticated */}
      {token && (
        <>
          <Link
            to="/properties"
            className={linkClass("/properties")}
            onClick={() => setOpen(false)}
          >
            Properties
          </Link>
          {/* Renter link */}
          {role === "renter" && status === "approved" && (
            <Link
              to="/my-bookings"
              className={linkClass("/my-bookings")}
              onClick={() => setOpen(false)}
            >
              My&nbsp;Bookings
            </Link>
          )}
          {/* Owner Dashboard (only if approved) */}
          {role === "owner" && status === "approved" && (
            <Link
              to="/owner"
              className={linkClass("/owner")}
              onClick={() => setOpen(false)}
            >
              Owner&nbsp;Dashboard
            </Link>
          )}

          {/* Admin link */}
          {role === "admin" && (
            <Link
              to="/admin/users"
              className={linkClass("/admin/users")}
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="block w-full md:w-auto px-3 py-2 rounded-md border border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition md:text-sm"
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  // ─────────────────────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────────────────────
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / brand */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          HouseHunt
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">{commonLinks}</div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden space-y-1 border-t border-gray-200 bg-white px-4 pb-4 pt-2">
          {commonLinks}
        </div>
      )}
    </header>
  );
}

export default Navbar;
