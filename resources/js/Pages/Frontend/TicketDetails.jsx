import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaPaperclip } from "react-icons/fa";

export default function TicketDetails() {
    const location = useLocation();
    const ticket = location.state?.ticket || {};
    console.log(ticket);
    const replies = location.state?.replies || []; // Accessing replies
    // State for owner name
    const [ownerName, setOwnerName] = useState("");

    // Fetch Owner Name from API
    useEffect(() => {
        const fetchOwnerName = async () => {
            try {
                if (ticket.owner) {
                    const response = await fetch(
                        `http://127.0.0.1:8000/api/admin/hesk-users/${ticket.owner}`
                    );
                    const data = await response.json();

                    if (data.success && data.data) {
                        setOwnerName(data.data.name); // Set fetched user name
                    } else {
                        setOwnerName("Unknown User");
                    }
                }
            } catch (error) {
                console.error("Error fetching owner name:", error);
                setOwnerName("Error fetching user");
            }
        };

        fetchOwnerName();
    }, [ticket.owner]); // Run only when ticket.owner changes

    // Format Date Utility
    const formatDate = (dateStr) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    // Status Map
    const statusMap = {
        0: { label: "New", color: "bg-red-500" },
        1: { label: "Waiting reply", color: "bg-orange-500" },
        2: { label: "Replied", color: "bg-blue-500" },
        3: { label: "Resolved", color: "bg-green-500" },
        4: { label: "In Progress", color: "bg-purple-500" },
        5: { label: "On Hold", color: "bg-red-500" },
    };

    // Category Map
    const categoryMap = {
        1: "Incident",
        2: "Request",
    };

    // Priority Map
    const priorityMap = {
        0: { label: "Low", color: "bg-blue-500" },
        1: { label: "Medium", color: "bg-green-500" },
        2: { label: "High", color: "bg-yellow-500" },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="text-white shadow-lg py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/">
                        <img
                            src="/images/fidelis-logo.png"
                            alt="Fidelis Logo"
                            className="h-16"
                        />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto max-w-4xl py-8 px-4">
                {/* Ticket Details */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Ticket Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Track ID:</strong> {ticket.trackid || "N/A"}
                        </div>
                        <div>
                            <strong>Name:</strong> {ticket.name || "N/A"}
                        </div>
                        <div>
                            <strong>Email:</strong> {ticket.email || "N/A"}
                        </div>
                        <div>
                            <strong>Category:</strong>{" "}
                            {categoryMap[ticket.emp_cat] || "Unknown"}
                        </div>
                        <div>
                            <strong>Priority:</strong>{" "}
                            {priorityMap[ticket.priority] ? (
                                <span
                                    className={`${
                                        priorityMap[ticket.priority].color
                                    } text-white px-2 py-1 rounded`}
                                >
                                    {priorityMap[ticket.priority].label}
                                </span>
                            ) : (
                                "Unknown"
                            )}
                        </div>
                        <div>
                            {" "}
                            <strong>Status:</strong>{" "}
                            {statusMap[ticket.status] ? (
                                <span
                                    className={`${
                                        statusMap[ticket.status].color
                                    } text-white px-2 py-1 rounded`}
                                >
                                    {statusMap[ticket.status].label}
                                </span>
                            ) : (
                                "Unknown"
                            )}
                        </div>
                        <div>
                            <strong>Created On:</strong>{" "}
                            {ticket.dt ? formatDate(ticket.dt) : "N/A"}
                        </div>
                        <div>
                            <strong>Updated On:</strong>{" "}
                            {ticket.lastchange
                                ? formatDate(ticket.lastchange)
                                : "N/A"}
                        </div>
                        <div>
                            <strong>Assigned User:</strong>{" "}
                            {ownerName || "Loading..."}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mt-6">
                        <strong>Message:</strong>
                        <p className="mt-2 bg-gray-100 p-4 rounded-md text-gray-900 text-sm">
                            {ticket.message || "No message provided"}
                        </p>
                    </div>
                </div>

                {/* Reply Section */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Replies
                    </h3>
                    {/* Loop through replies */}
                    {replies.length > 0 ? (
                        replies.map((reply, index) => (
                            <div key={index} className="mt-4">
                                <p className="mt-2 bg-gray-100 p-4 rounded-md text-gray-900 text-sm">
                                    {reply.message}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No replies yet.</p>
                    )}
                </div>

                {/* Reply Form */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Reply to Ticket
                    </h3>
                    <textarea
                        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[#f8703c] outline-none text-sm"
                        rows="5"
                        placeholder="Type your reply here..."
                    ></textarea>

                    {/* Attachment */}
                    <div className="mt-4 flex items-center gap-4">
                        <label className="flex items-center gap-2 text-[#f8703c] font-medium cursor-pointer">
                            <FaPaperclip size={20} />
                            <input type="file" className="hidden" />
                            Add Attachment
                        </label>
                        <span className="text-xs text-gray-500">
                            Max file size: 5MB
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button className="w-full sm:w-auto px-6 py-2 bg-[#f8703c] text-white font-medium rounded-md hover:bg-[#e0612d] transition duration-300">
                            Submit Reply
                        </button>
                        <button className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition duration-300">
                            Save and Continue Later
                        </button>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <Link
                        to="/"
                        className="inline-block px-6 py-2 bg-[#f8703c] text-white font-medium rounded-md hover:bg-[#0f2d4a] transition duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#133e5e] text-white py-4">
                <div className="container mx-auto text-center text-sm">
                    &copy; {new Date().getFullYear()} Fidelis Technologies. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
