import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/">
            <img
              src="/images/fidelis-logo.png"
              alt="Fidelis Logo"
              className="h-16"
            />
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto max-w-6xl text-center py-12 px-6 flex-grow">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#133e5e] mb-6">
          Hello, how can we help?
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
          {/* Submit a Ticket */}
          <Link to="/create-ticket">
            <div className="flex items-center justify-center p-6 shadow-lg rounded-lg hover:shadow-2xl transition duration-300">
              {/* Icon */}
              <div className="p-4 rounded-full bg-gradient-to-r from-[#133e5e] to-[#f8703c] hover:bg-gradient-to-l transition-all mr-4">
                <svg
                  className="icon h-12 w-12"
                  style={{ fill: "#fff" }}
                >
                  <use xlinkHref="/images/sprite.svg#icon-submit-ticket"></use>
                </svg>
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-[#133e5e] mb-2">
                  Submit a Ticket
                </h2>
                <p className="text-[#133e5e] text-sm">
                  Submit a new issue to a department
                </p>
              </div>
            </div>
          </Link>

          {/* View Existing Tickets */}
          <Link to="/view-ticket">
            <div className="flex items-center justify-center p-6 shadow-lg rounded-lg hover:shadow-2xl transition duration-300">
              {/* Icon */}
              <div className="p-4 rounded-full bg-gradient-to-r from-[#133e5e] to-[#f8703c] hover:bg-gradient-to-l transition-all mr-4">
                <svg
                  className="icon h-12 w-12"
                  style={{ fill: "#fff" }}
                >
                  <use xlinkHref="/images/sprite.svg#icon-document"></use>
                </svg>
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-[#133e5e] mb-2">
                  View Existing Tickets
                </h2>
                <p className="text-[#133e5e] text-sm">
                  View tickets you submitted in the past
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Panel Link */}
        <div className="mt-8">
          <Link
            to="/admin"
            className="inline-block text-[#133e5e] font-semibold underline text-lg hover:text-blue-800"
          >
            Go to Administration Panel
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#133e5e] text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; { new Date().getFullYear()} Fidelis Technologies. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
