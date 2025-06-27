import React, { useState } from "react";
import axios from "axios";

export default function BookingForm({ propertyId }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // "", "pending", "success", "error"
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "pending") return;
    setStatus("pending");
    try {
      await axios.post(
        "http://localhost:5000/api/bookings/request",
        { propertyId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("success");
      setMessage("");
      setTimeout(() => setStatus(""), 3500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(""), 4000);
    }
  };

  if (!token)
    return (
      <p className="mt-1 text-sm italic text-red-600">Please log in to book.</p>
    );

  const chip = {
    pending: (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        Sending…
      </span>
    ),
    success: (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
        ✓ Sent!
      </span>
    ),
    error: (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
        ✖ Failed. Retry
      </span>
    ),
  }[status];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-3 md:gap-4 rounded-xl border border-gray-200 bg-white/70 p-4 shadow-inner backdrop-blur"
    >
      <textarea
        rows={3}
        required
        className="w-full resize-none rounded-lg border border-gray-300 bg-white/80 p-3 text-sm placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 md:flex-1"
        placeholder="Write a friendly message to the owner…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex flex-col gap-2 md:w-40">
        <button
          type="submit"
          disabled={status === "pending"}
          className={`inline-flex items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            status === "pending"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 focus:ring-indigo-500"
          }`}
        >
          {status === "pending" ? "Sending…" : "Book"}
        </button>
        {chip && <div>{chip}</div>}
      </div>
    </form>
  );
}
