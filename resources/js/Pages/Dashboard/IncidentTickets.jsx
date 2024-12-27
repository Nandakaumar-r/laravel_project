import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function IncidentTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


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
                const response = await fetch("http://127.0.0.1:8000/api/admin/incident-tickets");
                if (!response.ok) throw new Error("Failed to fetch tickets");
                const result = await response.json();
console.log(result);
                if (result.success && result.data) {
                    setTickets(result.data);
                } else {
                    throw new Error("Invalid API response structure");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) return <Layout>Loading...</Layout>;
    if (error) return <Layout>Error: {error}</Layout>;

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-lg font-bold mb-4">Incident Tickets</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="text-white bg-[#f8703c]">
                            <tr>
                                <th className="px-6 py-3 cursor-pointer">ID</th>
                                <th className="px-6 py-3 text-left">Track ID</th>
                                <th className="px-6 py-3 text-left">Message</th>
                                <th className="px-6 py-3 text-left">Employee</th>
                                {/* <th className="border border-gray-300 px-4 py-2">Agent</th> */}
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-left">Due Date</th>
                                <th className="px-6 py-3 text-center">Priority</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
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
                </div>
            </div>
        </Layout>
    );
}
