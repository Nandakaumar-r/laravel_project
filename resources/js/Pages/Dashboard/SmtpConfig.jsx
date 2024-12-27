import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Swal from "sweetalert2";

export default function SmtpConfig() {
    const [smtpConfig, setSmtpConfig] = useState({
        smtp_host: "",
        smtp_port: "",
        smtp_username: "",
        smtp_password: "",
        smtp_encryption: "",
        smtp_from_address: "",
        smtp_from_name: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch SMTP Configuration
    useEffect(() => {
        const fetchSmtpConfig = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8000/api/admin/smtp-config");
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
            const response = await fetch("http://localhost:8000/api/admin/update-smtp-config", {
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
                <h1 className="text-lg font-bold ml-64 mb-4">SMTP Configuration</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-10">SMTP Host</label>
                        <input
                            type="text"
                            name="smtp_host"
                            value={smtpConfig.smtp_host}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-11">SMTP Port</label>
                        <input
                            type="number"
                            name="smtp_port"
                            value={smtpConfig.smtp_port}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-5">SMTP Encryption</label>
                        <select
                            name="smtp_encryption"
                            value={smtpConfig.smtp_encryption}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        >
                            <option value="">Select Encryption</option>
                            <option value="none">None</option>
                            <option value="ssl">SSL</option>
                            <option value="tls">TLS</option>
                        </select>
                    </div>
                    <h1 className="text-lg font-bold ml-64 mb-4">Username & Password</h1>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-6">SMTP Username</label>
                        <input
                            type="text"
                            name="smtp_username"
                            value={smtpConfig.smtp_username}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-6">SMTP Password</label>
                        <input
                            type="password"
                            name="smtp_password"
                            value={smtpConfig.smtp_password}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <h1 className="text-lg font-bold ml-64 mb-4">Sending Emails</h1>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-7">»From:« email</label>
                        <input
                            type="text"
                            name="smtp_from_address"
                            value={smtpConfig.smtp_from_address}
                            onChange={handleChange}
                            className="w-96 px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="display-block text-base font-semibold mb-2 p-7">»From:« name</label>
                        <input
                            type="text"
                            name="smtp_from_name"
                            value={smtpConfig.smtp_from_name}
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
