import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch {
        setItems(null); // error
      }
    })();
  }, []);

  if (items === null)
    return <p className="text-red-600">Couldn’t load bookings.</p>;
  if (items.length === 0)
    return <p className="text-gray-600">You have no bookings yet.</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold text-indigo-700">My Bookings</h1>
      <ul className="space-y-4">
        {items.map((b) => (
          <li key={b._id} className="rounded border p-4 shadow-sm">
            {/* property name */}
            <p>
              <strong>{b.propertyTitle}</strong> — {b.propertyLocation}
            </p>

            {/* created date */}
            <p className="text-sm text-gray-500">
              Sent {new Date(b.createdAt).toLocaleString()}
            </p>

            {/* status badge */}
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                b.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : b.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {b.status}
            </span>

            {/* renter’s original message */}
            {b.message && (
              <blockquote className="mt-2 rounded bg-gray-50 px-3 py-2 text-sm italic">
                {b.message}
              </blockquote>
            )}

            {/* owner contact (only after acceptance) */}
            {b.status === "accepted" && (
              <div className="mt-3 text-sm text-gray-700">
                <p className="font-medium">Owner details:</p>
                {b.ownerName && <p>{b.ownerName}</p>}
                {b.ownerEmail && <p>{b.ownerEmail}</p>}
                {b.ownerPhone && <p>{b.ownerPhone}</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
