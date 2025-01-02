import React, { useState } from "react";
import Layout from "./Layout";
import Swal from "sweetalert2";

export default function ExportTickets() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "startDate") {
            setStartDate(value);
        } else if (name === "endDate") {
            setEndDate(value);
        }
    };

    // Handle Form Submission
    const handleExport = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const apiUrl = `http://localhost:8000/api/admin/export-tickets?start_date=${startDate}&end_date=${endDate}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Failed to export tickets. No records found for the selected date range.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `tickets_${startDate}_to_${endDate}.csv`;
            link.click();

            Swal.fire({
                icon: "success",
                title: "Export Successful",
                text: "Tickets have been exported successfully!",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
                timer: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg ">
                <h2 className="text-2xl font-semibold text-gray-800  mb-6">Export Tickets</h2>
                <form onSubmit={handleExport} className="space-y-8">
                    <div className="form-group">
                        <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2 ">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={startDate}
                            onChange={handleChange}
                            required
                            className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={endDate}
                            onChange={handleChange}
                            required
                            className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="w-full md:w-1/2 pl-4 hidden md:block">
                            <img
                                src="/images/ticketimage2.jpg" // Add your image path here
                                alt="Illustration"
                                className="w-full h-[300px] object-cover rounded-lg"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`w-96 py-2 px-4 bg-[#f8703c] text-white rounded-lg shadow-md hover:bg-[#133e5e] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${loading ? "cursor-not-allowed opacity-50" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Exporting..." : "Export Tickets"}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 text-red-600  font-medium">
                        Error: {error}
                    </div>
                )}
            </div>
        </Layout>
    );
}
