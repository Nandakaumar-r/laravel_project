import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
  FaTachometerAlt,
  FaListAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaUsers,
  FaSignOutAlt,
  FaTools,
  FaTicketAlt,
  FaTrailer,
  FaCaretDown,
  FaUserCircle,
} from "react-icons/fa"; // Added caret down icon for dropdown

function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false); // State for settings dropdown
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  // Redirect if userId is not found
  if (!userId) {
    window.location.href = "/admin"; // Redirect to admin page
    return null; // Prevent rendering the component
  }
  useEffect(() => {
    const fetchUserName = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/admin/hesk-users/${userId}`);
          const data = await response.json();

          if (response.ok && data.success) {
            setUserName(data.data.name); // Assuming the API returns a "name" property for the logged-in user
          } else {
            setError(data.message || "An error occurred while fetching user data.");
            window.location.href = "/admin"; // Redirect to admin page if error
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("An error occurred while fetching user data.");
          window.location.href = "/admin"; // Redirect to admin page if error
        } finally {
          setIsLoading(false); // Stop loading after fetching
        }
      } else {
        setError("User not logged in.");
        setIsLoading(false);
        window.location.href = "/admin"; // Redirect to admin page if user is not logged in
      }
    };

    fetchUserName();
  }, []);


  // Helper function to abbreviate the name
  const getAbbreviatedName = (name) => {
    if (!name) return "U";  // Default if name is unavailable

    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0];  // Initials (first letter of first and last name)
    }
    return nameParts[0][0];  // Initial of the first name
  };


  // Handle logout
  const handleLogout = () => {
    // Clear userId from localStorage
    localStorage.removeItem("userId");

    // Redirect to the login page
    window.location.href = "/admin";
  };


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${isSidebarCollapsed ? "w-16" : "w-64"
          } bg-gray-800 text-white p-4 flex flex-col justify-between transition-all duration-300`}
      >
        <div className="space-y-4">
          <button
            className="mb-4 focus:outline-none text-gray-400 hover:text-white"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <FaBars size={20} />
            ) : (
              <FaTimes size={20} />
            )}
          </button>

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
          >
            <FaTachometerAlt size={20} />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link
            href="/admin/tickets"
            className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
          >
            <FaTicketAlt size={20} />
            {!isSidebarCollapsed && <span>Tickets</span>}
          </Link>
          <Link
            href="/admin/request-tickets"
            className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
          >
            <FaTrailer size={20} />
            {!isSidebarCollapsed && <span>Request Tickets</span>}
          </Link>
          <Link
            href="/admin/incident-tickets"
            className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
          >
            <FaTicketAlt size={20} />
            {!isSidebarCollapsed && <span>Incident Tickets</span>}
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
          >
            <FaListAlt size={20} />
            {!isSidebarCollapsed && <span>Categories</span>}
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
          >
            <FaUsers size={20} />
            {!isSidebarCollapsed && <span>Users</span>}
          </Link>
          <Link
            href="/admin/emails"
            className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
          >
            <FaEnvelope size={20} />
            {!isSidebarCollapsed && <span>Fidelis Emails</span>}
          </Link>
          {/* Dropdown for Settings */}
          <div className="relative">
            <button
              className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded w-full"
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
            >
              <FaTools size={20} />
              {!isSidebarCollapsed && <span>Settings</span>}
              {!isSidebarCollapsed && (
                <FaCaretDown
                  className={`ml-auto transform transition-transform ${isSettingsDropdownOpen ? "rotate-180" : ""
                    }`}
                  size={14}
                />
              )}
            </button>

            {isSettingsDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-gray-700 rounded shadow-lg w-full">
                <Link
                  href="/admin/db-config"
                  className="block py-2 px-4 hover:bg-gray-600 rounded"
                >
                  General
                </Link>
                <Link
                  href="/admin/smtp-config"
                  className="block py-2 px-4 hover:bg-gray-600 rounded"
                >
                  SMTP Configuration
                </Link>
                <Link
                  href="/admin/notify-email"
                  className="block py-2 px-4 hover:bg-gray-600 rounded"
                >
                  Notification Settings
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* User Dropdown with Logout Button */}
        <div className="mt-auto">
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div> // Display error message if any
          ) : (
            <button
              className="flex items-center gap-2 py-2 text-white hover:text-white w-full"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {/* Show initials if collapsed or full name if expanded */}
              <span className="flex-1 text-left capitalize">
                {isSidebarCollapsed ? getAbbreviatedName(userName) : userName || "Guest"}
              </span>
              {/* Show caret down icon beside username */}
              <FaCaretDown size={14} />
            </button>
          )}

          {isDropdownOpen && (
            <div className="mt-2 bg-gray-700 rounded shadow-lg">
              {/* Profile Link - show only icon when sidebar is collapsed */}
              <Link
                href="/admin/profile"
                className="flex items-center gap-4 py-2 px-2 hover:bg-gray-700 rounded"
              >
                <FaUserCircle size={20} />
                {!isSidebarCollapsed && <span>Profile</span>}
              </Link>
              {/* Logout Button - show only icon when sidebar is collapsed */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 py-2 px-2 hover:bg-red-700 rounded text-white-400 hover:text-white"
              >
                {isSidebarCollapsed ? <FaSignOutAlt size={20} /> : <><FaSignOutAlt size={20} /><span>Logout</span></>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {children} {/* This will render the content passed from the page */}
      </div>
    </div>
  );
}

export default Layout;
