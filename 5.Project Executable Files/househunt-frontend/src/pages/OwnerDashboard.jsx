// src/pages/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

/* ------------------------------------------------------------------
   get a NEW axios instance every call so the token is always current
------------------------------------------------------------------- */
const api = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: "http://localhost:5000/api/owner",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

/* ------------------------------------------------------------------
   Page shell
------------------------------------------------------------------- */
export default function OwnerDashboard() {
  const [tab, setTab] = useState("properties"); // "properties" | "bookings"

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-indigo-700">
        Owner&nbsp;Dashboard
      </h1>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setTab("properties")}
          className={`px-4 py-2 rounded ${
            tab === "properties"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          My&nbsp;Properties
        </button>
        <button
          onClick={() => setTab("bookings")}
          className={`px-4 py-2 rounded ${
            tab === "bookings"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Incoming&nbsp;Bookings
        </button>
      </div>

      {tab === "properties" ? <MyProps /> : <IncomingBookings />}
    </main>
  );
}

/* ------------------------------------------------------------------
   MyProps – list + add property
------------------------------------------------------------------- */
function MyProps() {
  const empty = {
    title: "",
    description: "",
    rent: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    furnished: false,
    type: "apartment",
    image: null,
    preview: "",
  };

  const [form, setForm] = useState(empty);
  const [list, setList] = useState([]);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState(""); // "", "ok", "fail"

  /* --- fetch list --- */
  const fetchList = async () => {
    try {
      const res = await api().get("/properties");
      setList(res.data);
    } catch (err) {
      if (err.response?.status === 401) window.location.href = "/login";
      console.error(err);
    }
  };
  useEffect(() => {
    fetchList();
  }, []);

  /* --- handle file --- */
  const handleFile = (file) =>
    !file
      ? setForm({ ...form, image: null, preview: "" })
      : setForm({ ...form, image: file, preview: URL.createObjectURL(file) });

  /* --- add property --- */
  const add = async (e) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    setFeedback("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "image") v && fd.append("image", v);
        else if (k !== "preview") fd.append(k, v);
      });

      await api().post("/properties", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFeedback("ok");
      setForm(empty);
      fetchList();
    } catch (err) {
      console.error(err);
      setFeedback("fail");
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setAdding(false);
      setTimeout(() => setFeedback(""), 4000);
    }
  };

  /* --- JSX --- */
  return (
    <>
      {/* Add-property form */}
      <form
        onSubmit={add}
        className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Rent (₹)"
          value={form.rent}
          onChange={(e) => setForm({ ...form, rent: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <textarea
          rows={2}
          className="border p-2 rounded md:col-span-2 lg:col-span-3"
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          min="0"
          className="border p-2 rounded"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
        />
        <input
          type="number"
          min="0"
          className="border p-2 rounded"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
        />
        <input
          type="number"
          min="0"
          className="border p-2 rounded"
          placeholder="Size (sq-ft)"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
        </select>

        <label className="flex items-center gap-2 border p-2 rounded">
          <input
            type="checkbox"
            checked={form.furnished}
            onChange={(e) => setForm({ ...form, furnished: e.target.checked })}
          />
          Furnished
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          className="border p-2 rounded"
        />

        {form.preview && (
          <img
            src={form.preview}
            alt=""
            className="h-24 w-full object-cover rounded border md:col-span-2 lg:col-span-3"
          />
        )}

        <button
          type="submit"
          disabled={adding}
          className={`md:col-span-2 lg:col-span-3 rounded px-4 py-2 text-white ${
            adding
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {adding ? "Uploading…" : "Add Property"}
        </button>

        {feedback === "ok" && (
          <p className="text-sm text-green-600 md:col-span-2 lg:col-span-3">
            ✔ Property added!
          </p>
        )}
        {feedback === "fail" && (
          <p className="text-sm text-red-600 md:col-span-2 lg:col-span-3">
            ✖ Couldn’t add property — check console/network tab.
          </p>
        )}
      </form>

      {/* List */}
      <ul className="space-y-3">
        {list.map((p) => (
          <li key={p._id} className="flex justify-between border rounded p-4">
            <div className="flex items-center gap-3">
              {p.imageUrl && (
                <img
                  src={`http://localhost:5000${p.imageUrl}`}
                  alt={p.title}
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-600">
                  ₹{p.rent} — {p.bedrooms || 0}B/{p.bathrooms || 0}B —{" "}
                  {p.size || "?"} sq-ft
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                await api().delete(`/properties/${p._id}`);
                fetchList();
              }}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ------------------------------------------------------------------
   IncomingBookings
------------------------------------------------------------------- */
/* ─ IncomingBookings  –  owner side ─ */
function IncomingBookings() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await api().get("/bookings");
      setItems(res.data);
    } catch (err) {
      if (err.response?.status === 401) window.location.href = "/login";
    }
  };
  useEffect(() => { fetchItems(); }, []);

  const update = async (id, status) => {
    await api().patch(`/bookings/${id}/status`, { status });
    fetchItems();
  };

  if (items.length === 0)
    return <p className="text-gray-600">No incoming bookings.</p>;

  return (
    <ul className="space-y-4">
      {items.map((b) => (
        <li key={b._id} className="rounded border p-4 shadow-sm">
          {/* header row */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {b.renterName ?? "Someone"} requested&nbsp;
                <em>{b.propertyTitle}</em>
              </p>
              <p className="text-sm text-gray-500">
                {b.renterEmail && <span>{b.renterEmail} · </span>}
                {new Date(b.createdAt).toLocaleString()}
              </p>
            </div>

            {/* status badge */}
            {b.status !== "pending" && (
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  b.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {b.status}
              </span>
            )}
          </div>

          {/* optional renter message */}
          {b.message && (
            <blockquote className="mt-3 rounded bg-gray-50 px-3 py-2 text-sm italic text-gray-700">
              {b.message}
            </blockquote>
          )}

          {/* action buttons */}
          {b.status === "pending" && (
            <div className="mt-4 space-x-2">
              <button
                onClick={() => update(b._id, "accepted")}
                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => update(b._id, "rejected")}
                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
