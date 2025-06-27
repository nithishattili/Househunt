// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "renter",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    /* extra front-end guard: owner must supply phone */
    if (form.role === "owner" && form.phone.trim() === "") {
      return setError("Phone number is required for owners.");
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed, please try again."
      );
    }
  };

  /* phone field is required only for owner */
  const phoneRequired = form.role === "owner";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Create your <span className="text-indigo-600">Househunt</span> account
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            />
          </div>

          {/* Email */}
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
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            />
          </div>

          {/* Phone (conditional) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone {phoneRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength={10}
              required={phoneRequired}
              placeholder="10-digit mobile number"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            />
          </div>

          {/* Password */}
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
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            />
          </div>

          {/* Role select */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            >
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Register
          </button>
        </form>

        {/* Already have account */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
