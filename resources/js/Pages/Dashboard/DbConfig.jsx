import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Swal from "sweetalert2";

export default function DbConfig() {
    const [smtpConfig, setSmtpConfig] = useState({
        db_host: "",
        db_name: "",
        db_username: "",
        db_password: "",
        db_port: "",
        app_url: "",
        app_name: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch SMTP Configuration
    useEffect(() => {
        const fetchSmtpConfig = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8000/api/admin/db-config");
                if (!response.ok) throw new Error("Failed to fetch SMTP configuration");
                const result = await response.json();

                setSmtpConfig(result); // Populate the configuration data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSmtpConfig();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSmtpConfig((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/api/admin/update-db-config`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(smtpConfig),
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
                    text: "Failed to update SMTP configuration.",
                });
            }
        } catch (err) {
            // Show error popup for unexpected errors
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while updating SMTP configuration.",
            });
        }
    };

    if (loading) return <Layout>Loading...</Layout>;
    if (error) return <Layout>Error: {error}</Layout>;

    return (
        <Layout>
            <div className="p-6 bg-white shadow-md rounded">
                <h1 className="text-lg font-bold ml-64 mb-4">General settings</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Website Settings */}
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-12">Website Title</label>
                        <input
                            type="text"
                            name="app_name"
                            value={smtpConfig.app_name}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-12">Website URL</label>
                        <input
                            type="text"
                            name="app_url"
                            value={smtpConfig.app_url}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-10">Help Desk Title</label>
                        <input
                            type="text"
                            name="app_name"
                            value={smtpConfig.app_name}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    {/* Database Settings */}
                    <h1 className="text-lg font-bold ml-64 mb-4">Database Settings</h1>
                    <div>
                        <label className="display-block text-base font-semibold font-black mb-2 p-11">Database Host</label>
                        <input
                            type="text"
                            name="db_host"
                            value={smtpConfig.db_host}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-10">Database Name</label>
                        <input
                            type="text"
                            name="db_name"
                            value={smtpConfig.db_name}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-12">DB Username</label>
                        <input
                            type="text"
                            name="db_username"
                            value={smtpConfig.db_username}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-12">DB Password</label>
                        <input
                            type="password"
                            name="db_password"
                            value={smtpConfig.db_password}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-11">Database Port</label>
                        <input
                            type="number"
                            name="db_port"
                            value={smtpConfig.db_port}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-[#f8703c] ml-64 text-white font-semibold px-6 py-3 w-78 rounded hover:bg-[#e7612e] focus:outline-none focus:ring-2 focus:ring-[#f8703c]"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

            </div>
        </Layout>
    );
}
