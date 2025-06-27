// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      // Store token and redirect
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed, please try again."
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Sign in to <span className="text-indigo-600">Househunt</span>
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={handleChange}
              placeholder="you@example.com"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
