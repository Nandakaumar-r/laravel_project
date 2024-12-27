import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import { FaPaperclip } from "react-icons/fa"; // Import paperclip icon for attachments

export default function AdminTicketDetails() {
    const { id } = useParams(); // Get the ticket ID from the URL
    const [ticket, setTicket] = useState(null);
    const [users, setUsers] = useState([]); // State to hold users data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status
    const [replyMessage, setReplyMessage] = useState(""); // State for reply message
    const [popupMessage, setPopupMessage] = useState(""); // State for popup message
    const [popupType, setPopupType] = useState(""); // Type of popup: 'success' or 'error'
    const [showPopup, setShowPopup] = useState(false); // Controls visibility of the popup
    const [messages, setMessages] = useState([]); // Array to store posted messages
    // Static data for subcategories based on category id
    const incidentSubCategories = [
        { id: 1, name: "Hardware" },
        { id: 2, name: "Software" },
        { id: 3, name: "Network" },
        { id: 4, name: "Security" },
        { id: 5, name: "Others" },
    ];

    const requestSubCategories = [
        { id: 1, name: "Access" },
        { id: 2, name: "Hardware" },
        { id: 3, name: "Information" },
        { id: 4, name: "Service" },
        { id: 5, name: "Others" },
    ];

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/admin/tickets/${id}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch ticket details");
                }
                const result = await response.json();
                console.log("Fetched Ticket Data: ", result.ticket); // Debugging log
                setTicket(result.ticket); // Assuming the API response gives the ticket details directly
                setSelectedStatus(result.ticket.status); // Set the initial status
            } catch (error) {
                console.error("Error fetching ticket details:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/admin/hesk-users"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const result = await response.json();
                setUsers(result.data); // Set users data
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error.message);
            }
        };

        fetchTicketDetails();
        fetchUsers();
    }, [id]);

    const getAssignedUserName = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user ? user.name : "N/A";
    };

    // Mapping status codes to human-readable status
    const statusOptions = {
        0: "New",
        1: "Waiting reply",
        2: "Replied",
        3: "Resolved",
        4: "In Progress",
        5: "On Hold",
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/tickets/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: selectedStatus }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update ticket status");
            }

            const result = await response.json();
            console.log(result);
            setTicket(result.ticket);

            // Check if the email is triggered by backend
            if (result.ticket.status === 3) {
                console.log(
                    "Status updated to resolved, backend should send email"
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setError(error.message);
        }
    };
    const handleSubmitReply = async () => {
        if (!replyMessage.trim()) {
            showPopupMessage("Reply message cannot be empty!", "error");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/tickets/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: replyMessage }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit reply");
            }

            const result = await response.json();
            console.log("Reply submitted:", result);

      // Add the new message to the messages array
      setMessages((prevMessages) => [...prevMessages, replyMessage]);
            // Show success popup and clear the input field
            showPopupMessage("Reply submitted successfully!", "success");
            setReplyMessage("");
        } catch (error) {
            console.error("Error submitting reply:", error);
            showPopupMessage(
                "Failed to submit reply. Please try again.",
                "error"
            );
        }
    };
    // Function to show popup message
    const showPopupMessage = (message, type) => {
        setPopupMessage(message);
        setPopupType(type);
        setShowPopup(true);

        // Close the popup after 3 seconds
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center mt-10 text-lg">
                    Loading ticket details...
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="text-center mt-10 text-lg text-red-600">
                    Error: {error}
                </div>
            </Layout>
        );
    }

    if (!ticket) {
        return (
            <Layout>
                <div className="text-center mt-10 text-lg text-gray-500">
                    No details available for this ticket.
                </div>
            </Layout>
        );
    }

    // Conditional category mapping
    const categoryName =
        ticket.category === 1
            ? "Submit an Incident"
            : ticket.category === 2
            ? "Submit a Request"
            : "N/A";

    // Mapping priority to string values based on the API response
    const priority =
        ticket.priority === "2"
            ? "High"
            : ticket.priority === "1"
            ? "Medium"
            : ticket.priority === "0"
            ? "Low"
            : "N/A";

    // Get the assigned owner's name using the helper function
    const assignedTo = getAssignedUserName(ticket.owner);

    // Debugging the emp_cat value
    console.log("Ticket emp_cat: ", ticket.emp_cat);

    // Get the subcategory name based on category and emp_cat
    const getSubCategoryName = () => {
        if (ticket.category === 1) {
            const subCategory = incidentSubCategories.find(
                (sub) => sub.id === Number(ticket.emp_cat)
            ); // Convert to number
            console.log("Incident Subcategory: ", subCategory); // Debugging log
            return subCategory ? subCategory.name : "N/A";
        } else if (ticket.category === 2) {
            const subCategory = requestSubCategories.find(
                (sub) => sub.id === Number(ticket.emp_cat)
            ); // Convert to number
            console.log("Request Subcategory: ", subCategory); // Debugging log
            return subCategory ? subCategory.name : "N/A";
        }
        return "N/A";
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4  p-2 rounded-md">
                    Ticket Details
                </h1>
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    {/* Ticket Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold rounded-md">
                                Track ID:{" "}
                                <span className="text-blue-600">
                                    {ticket.trackid}
                                </span>
                            </h3>
                        </div>
                        <div className="flex items-center">
                            {/* Status Display with Dropdown */}
                            <p className="font-semibold text-green-600 mr-4">
                                Status: {statusOptions[ticket.status] || "N/A"}
                            </p>
                            <select
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                className="p-2 border w-40 rounded-lg"
                            >
                                {Object.entries(statusOptions).map(
                                    ([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    )
                                )}
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                className="ml-4 bg-[#f8703c] text-white px-6 py-2 rounded-md"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <strong>Name:</strong> {ticket.name || "N/A"}
                        </div>
                        <div>
                            <strong>Email:</strong> {ticket.email || "N/A"}
                        </div>
                        <div>
                            <strong>Ticket Type:</strong>{" "}
                            {categoryName || "N/A"}
                        </div>
                        <div>
                            <strong>Category:</strong>{" "}
                            {getSubCategoryName() || "N/A"}
                        </div>
                        <div>
                            <strong>Priority:</strong> {priority || "N/A"}
                        </div>
                        <div>
                            <strong>Assigned To:</strong> {assignedTo || "N/A"}
                        </div>
                        <div>
                            <strong>Created At:</strong> {ticket.dt || "N/A"}
                        </div>
                        <div>
                            <strong>Due Date:</strong>{" "}
                            {ticket.due_date || "N/A"}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t-2 pt-4">
                        <h4 className="font-semibold rounded-md">
                            Description:
                        </h4>
                        <p>{ticket.message || "No description provided."}</p>
                    </div>
                </div>

                <div>
                <h3 className="text-lg font-semibold mb-2">Reply to Ticket</h3>

{/* Display posted messages */}
<div className="mb-4">
  {messages.map((message, index) => (
    <div
      key={index}
      className="bg-white-100 border border-gray-300 rounded-md p-2 mb-2"
    >
      {message}
    </div>
  ))}
</div>
                    <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full border pb-14 rounded-md"
                        placeholder="Type your reply here..."
                    ></textarea>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSubmitReply}
                            className="bg-[#f8703c] text-white px-6 py-2 rounded-md"
                        >
                            Submit Reply
                        </button>
                    </div>

                    {/* Popup */}
                    {showPopup && (
                        <div
                            className={`fixed top-4 right-4 px-6 py-3 rounded-md shadow-md text-white ${
                                popupType === "success"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                        >
                            {popupMessage}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
