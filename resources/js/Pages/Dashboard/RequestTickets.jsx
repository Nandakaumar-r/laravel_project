import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function RequestTickets() {
    const [tickets, setTickets] = useState([]);
    const [totalTickets, setTotalTickets] = useState(0);
    const [openTicketsCount, setOpenTicketsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term
    const [autoReload, setAutoReload] = useState(
        JSON.parse(localStorage.getItem("autoReload")) || false
    );
    const [countdown, setCountdown] = useState(30);
    const navigate = useNavigate();

    const categoryMap = {
        1: "Submit an Incident",
        2: "Submit a Request",
    };

    const priorityMap = {
        0: { label: "Low", color: "bg-blue-500" },
        1: { label: "Medium", color: "bg-green-500" },
        2: { label: "High", color: "bg-yellow-500" },
    };

    const statusMap = {
        0: { label: "New", color: "bg-red-500" },
        1: { label: "Waiting reply", color: "bg-orange-500" },
        2: { label: "Replied", color: "bg-blue-500" },
        3: { label: "Resolved", color: "bg-green-500" },
        4: { label: "In Progress", color: "bg-purple-500" },
        5: { label: "On Hold", color: "bg-red-500" },
    };

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/admin/request-tickets?page=${currentPage}&perPage=${perPage}&search=${searchTerm}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch tickets");
                }
                const result = await response.json();

                setTickets(result.tickets.data || []);
                setTotalTickets(result.tickets.total || 0);

                // Count open tickets (status 0)
                const openTickets = result.tickets.data.filter(
                    (ticket) => ticket.status === 0
                );
                setOpenTicketsCount(openTickets.length); // Update open tickets count
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [currentPage, perPage, searchTerm]); // Refetch tickets when searchTerm changes

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedTickets = [...tickets].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === "ascending") {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    });

    useEffect(() => {
        let timer;
        if (autoReload) {
            if (countdown === 0) {
                window.location.reload();
            } else {
                timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            }
        }
        return () => clearTimeout(timer);
    }, [autoReload, countdown]);

    const handleCheckboxChange = () => {
        const newAutoReloadState = !autoReload;
        setAutoReload(newAutoReloadState);
        localStorage.setItem("autoReload", JSON.stringify(newAutoReloadState));
        setCountdown(30); // Reset the countdown on toggle
    };

    const totalPages = Math.ceil(totalTickets / perPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center mt-10 text-lg">
                    Loading tickets...
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

    return (
        <Layout>
            <div className="p-6">
                {/* Search and ticket info section */}
                <div className="flex justify-between items-center mb-4">
                    {/* Search Bar */}
                    <div className="flex-grow mr-4 max-w-md">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by Track ID or Email"
                            className="p-2 border rounded-lg w-full"
                        />
                    </div>

                    {/* Ticket Information */}
                    <div className="flex flex-col md:flex-row md:space-x-6 text-right text-gray-700">
                        <div>
                            <strong>Total Tickets:</strong> {totalTickets}
                        </div>
                        <div>
                            <strong>Open Tickets:</strong> {openTicketsCount}
                        </div>
                        <div className="flex justify-end items-center mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={autoReload}
                                    onChange={handleCheckboxChange}
                                    className="cursor-pointer"
                                />
                                <span>
                                    Auto reload page
                                    {autoReload ? ` (${countdown}s)` : ""}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {tickets.length > 0 ? (
                        <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="text-white bg-[#f8703c]">
                                <tr>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("id")}
                                    >
                                        ID{" "}
                                        {sortConfig.key === "id"
                                            ? sortConfig.direction ===
                                              "ascending"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Track ID
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("message")}
                                    >
                                        Message{" "}
                                        {sortConfig.key === "message"
                                            ? sortConfig.direction ===
                                              "ascending"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Employee
                                    </th>
                                    {/* <th className="px-6 py-3 text-left">
                                        Agent
                                    </th> */}
                                    <th className="px-6 py-3 text-center">
                                        Status
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("due_date")}
                                    >
                                        Due Date{" "}
                                        {sortConfig.key === "due_date"
                                            ? sortConfig.direction ===
                                              "ascending"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("priority")}
                                    >
                                        Priority{" "}
                                        {sortConfig.key === "priority"
                                            ? sortConfig.direction ===
                                              "ascending"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="border-b hover:bg-gray-100 transition"
                                    >
                                        <td className="px-6 py-3">
                                            {ticket.id}
                                        </td>
                                        <td className="px-6 py-3">
                                            {ticket.trackid}
                                        </td>
                                        <td className="px-6 py-3">
                                            <p className="text-center truncate w-20">{ticket.message}</p>
                                        </td>
                                        <td className="px-6 py-3">
                                            {ticket.name}
                                        </td>
                                        {/* <td className="px-6 py-3">
                                            {ticket.owner_name}
                                        </td> */}
                                        <td className="px-6 py-3 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-white ${
                                                    statusMap[ticket.status]
                                                        ?.color || "bg-gray-400"
                                                }`}
                                            >
                                                {statusMap[ticket.status]
                                                    ?.label || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            {ticket.due_date.split(" ")[0]}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-white ${
                                                    priorityMap[ticket.priority]
                                                        ?.color || "bg-gray-400"
                                                }`}
                                            >
                                                {priorityMap[ticket.priority]
                                                    ?.label || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                className="bg-[#f8703c] text-white px-4 py-2 rounded hover:bg-[#e7612e]"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/tickets/${ticket.id}`
                                                    )
                                                }
                                            >
                                                View Ticket
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center mt-10 text-lg text-gray-500">
                            No tickets available.
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 mx-1 bg-gray-300 hover:bg-gray-400 rounded"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 mx-1 bg-gray-300 hover:bg-gray-400 rounded"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </Layout>
    );
}
