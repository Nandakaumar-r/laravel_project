import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout"; // Assuming you have a Layout component

const Profile = () => {
  const [formData, setFormData] = useState({
    user: "",
    name: "",
    pass: "",
    email: "",
    categories: "",
    isadmin: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false); // State to control popup visibility

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  // Redirect if userId is not found
  if (!userId) {
    window.location.href = "/admin"; // Redirect to admin page
    return null; // Prevent rendering the component
  }

  const apiUrl = `http://127.0.0.1:8000/api/admin/hesk-users/${userId}`;

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(apiUrl);
        const {
          user,
          name,
          email,
          pass,
          categories,
          isadmin,
        } = response.data.data; // Adjust based on your actual API response
        setFormData({ user, pass, name, email, categories, isadmin });
      } catch (err) {
        setError("Failed to fetch user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, apiUrl]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data to send in the PUT request
      const updatedData = { ...formData };

      await axios.put(apiUrl, updatedData); // Update user details via PUT API
      setShowSuccess(true); // Show success popup
      setTimeout(() => {
        setShowSuccess(false); // Hide success popup after 3 seconds
      }, 3000);
    } catch (err) {
      setError("Failed to update user details. Please try again.");
    }
  };

  // Show an error message if something went wrong
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center mb-6">Edit Profile</h1>

        {/* Success Popup */}
        {showSuccess && (
          <div className="text-center bg-green-500 mt-10 text-lg">
            <p>User details updated successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 capitalize">
              Username:
            </label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 capitalize">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 capitalize">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="pass" className="block text-sm font-medium text-gray-700 capitalize">
              Password:
            </label>
            <input
              type="password"
              id="pass"
              name="pass"
              value={formData.pass}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="categories" className="block text-sm font-medium text-gray-700 capitalize">
              Category:
            </label>
            <select
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="1">Submit an Incident</option>
              <option value="2">Submit a Request</option>
            </select>
          </div>

          {/* Admin Status Dropdown */}
          <div>
            <label htmlFor="isadmin" className="block text-sm font-medium text-gray-700 capitalize">
              Admin Status:
            </label>
            <select
              id="isadmin"
              name="isadmin"
              value={formData.isadmin}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="1">Admin</option>
              <option value="0">Staff</option>
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-6 w-full p-3 bg-[#f8703c] text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
