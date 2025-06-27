// src/pages/Protected.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function Protected() {
  const [message, setMessage] = useState("Loading…");

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(
          `${res.data.message} \u2014 User&nbsp;ID: ${res.data.user.userId}`
        );
      } catch (err) {
        setMessage(
          `Access denied: ${err.response?.data?.message || "Unauthorized"}`
        );
      }
    };

    fetchProtected();
  }, []);

  // Simple runtime check to style success vs error
  const isError = message.toLowerCase().startsWith("access denied");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-lg p-8 sm:p-10 text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">
          Protected&nbsp;Page
        </h2>

        <p
          className={`whitespace-pre-line text-base leading-relaxed ${
            {
              true: "text-gray-700",
              false: "text-red-600 font-medium",
            }[!isError]
          }`}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </main>
  );
}

export default Protected;
