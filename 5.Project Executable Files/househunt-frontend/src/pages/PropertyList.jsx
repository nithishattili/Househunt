import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "../components/BookingForm";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/properties");
        setProperties(res.data);
      } catch {
        setError("Could not load properties. Try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-lg font-medium text-gray-600 animate-pulse">
          Loading…
        </span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="mb-10 flex items-center gap-2 text-3xl font-extrabold text-indigo-700">
        <span>🏘️</span>
        Available&nbsp;Properties
      </h1>

      {properties.length === 0 ? (
        <p className="text-gray-600">No properties available right now.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {properties.map((p) => (
            <article
              key={p._id}
              className="flex flex-col rounded-3xl border border-gray-200 bg-white/90 shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* banner */}
              {p.imageUrl && (
                <div className="aspect-[3/2] w-full overflow-hidden">
                  <img
                    src={`http://localhost:5000${p.imageUrl}`}
                    alt={p.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}

              <div className="space-y-3 p-6">
                <h2 className="text-xl font-bold text-indigo-700">{p.title}</h2>
                <p className="text-sm text-gray-600">{p.description}</p>

                <dl className="mt-4 space-y-1 text-sm text-gray-700">
                  <div className="flex">
                    <dt className="font-medium">Location:&nbsp;</dt>
                    <dd>{p.location}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium">Rent:&nbsp;</dt>
                    <dd>₹{p.rent}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium">Beds/Baths:&nbsp;</dt>
                    <dd>
                      {p.bedrooms || 0}/{p.bathrooms || 0}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium">Size:&nbsp;</dt>
                    <dd>{p.size ? `${p.size} sq-ft` : "—"}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium">Type:&nbsp;</dt>
                    <dd className="capitalize">{p.type}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium">Furnished:&nbsp;</dt>
                    <dd>{p.furnished ? "Yes" : "No"}</dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                <BookingForm propertyId={p._id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
