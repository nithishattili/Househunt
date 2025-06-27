import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/owners/pending",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOwners(data);
      } catch (err) {
        alert("Failed to load pending owners");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const approveOwner = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/owners/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOwners((prev) => prev.filter((o) => o._id !== id));
    } catch {
      alert("Failed to approve owner");
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">
        Pending Owners
      </h1>

      {owners.length === 0 ? (
        <p className="text-gray-600">No pending owners.</p>
      ) : (
        <ul className="space-y-3">
          {owners.map((o) => (
            <li
              key={o._id}
              className="flex justify-between items-center bg-gray-50 border rounded-lg p-4"
            >
              <div>
                <p className="font-medium text-gray-800">{o.name}</p>
                <p className="text-sm text-gray-500">{o.email}</p>
              </div>
              <button
                onClick={() => approveOwner(o._id)}
                className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default AdminUsers;
