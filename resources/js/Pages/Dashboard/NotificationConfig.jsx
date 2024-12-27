import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Swal from "sweetalert2";

export default function NotificationConfig() {
    const [notificationConfig, setNotificationConfig] = useState({
        id: "",
        tech_team_email: "",
        tech_leader_email: "",
        hr_officer_email: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch SMTP Configuration
    useEffect(() => {
        const fetchNotificationConfig = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8000/api/admin/notify-email");
                if (!response.ok) throw new Error("Failed to fetch SMTP configuration");
                const result = await response.json();

                if (Array.isArray(result) && result.length > 0) {
                    setNotificationConfig(result[0]);
                } else {
                    throw new Error("No data found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationConfig();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotificationConfig((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const id = notificationConfig.id || 1; // Default to 1 if id is not available
            const response = await fetch(`http://localhost:8000/api/admin/notify-email/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(notificationConfig),
            });
            const result = await response.json();

            if (result.success) {
                // Show success popup
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "SMTP configuration updated successfully!",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                // Show error popup
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    timer: 3000,
                    text: "Failed to update SMTP configuration.",
                });
            }
        } catch (err) {
            // Show error popup for unexpected errors
            Swal.fire({
                icon: "error",
                title: "Error",
                timer: 3000,
                text: "An error occurred while updating SMTP configuration.",
            });
        }
    };

    if (loading) return <Layout>Loading...</Layout>;
    if (error) return <Layout>Error: {error}</Layout>;

    return (
        <Layout>
            <div className="p-6 bg-white shadow-md rounded">
                <h1 className="text-lg font-bold ml-64 mb-4">Notification Email Configuration</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Website Settings */}
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-14">Tech Team Email</label>
                        <input
                            type="email"
                            name="tech_team_email"
                            value={notificationConfig.tech_team_email}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-14">Tech Lead Email</label>
                        <input
                            type="email"
                            name="tech_leader_email"
                            value={notificationConfig.tech_leader_email}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-14">HR Officer Email</label>
                        <input
                            type="text"
                            name="hr_officer_email"
                            value={notificationConfig.hr_officer_email}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-[#f8703c] ml-72 text-white font-semibold px-6 py-3 w-78 rounded hover:bg-[#e7612e] focus:outline-none focus:ring-2 focus:ring-[#f8703c]"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

            </div>
        </Layout>
    );
}
