// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Search & Filter",
    description:
      "Narrow results by location, rent range, and amenities so you only see homes that fit your lifestyle.",
  },
  {
    title: "Book Instantly",
    description:
      "Reserve a property online once you’re logged in – skip endless phone calls and paperwork.",
  },
  {
    title: "Verified Hosts",
    description:
      "Every listing is screened to keep scammers out and give you peace of mind.",
  },
  {
    title: "Secure Payments",
    description:
      "Pay deposits safely through our encrypted payment gateway and receive instant receipts.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description:
      "Sign up with your email in less than a minute to start saving favourites and booking homes.",
  },
  {
    number: "02",
    title: "Browse Properties",
    description:
      "Use smart filters to discover apartments and houses that match your budget and needs.",
  },
  {
    number: "03",
    title: "Book & Move In",
    description:
      "Reserve instantly, pay online, and move in on your chosen date – it’s that simple!",
  },
];

function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            Househunt
          </h1>
          <p className="mt-4 text-lg md:text-xl font-light">
            Find your next rental home in seconds – no middle‑men, no hassle.
          </p>
          <Link
            to="/properties"
            className="inline-block mt-8 rounded-full bg-white/90 px-8 py-3 text-base font-semibold text-indigo-700 shadow-md transition hover:bg-white"
          >
            Browse Listings
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
          Why&nbsp;Househunt?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-12">
            How&nbsp;It&nbsp;Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(({ number, title, description }) => (
              <div
                key={number}
                className="relative group rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-8 shadow-md hover:-translate-y-1 hover:shadow-lg transition transform duration-300"
              >
                <span className="absolute -top-4 left-4 text-6xl font-extrabold text-indigo-200/60 group-hover:text-indigo-300/70 select-none">
                  {number}
                </span>
                <h3 className="mt-8 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
