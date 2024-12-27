import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function CreateTicket() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [priority, setPriority] = useState("");
    const [issueCategories, setIssueCategories] = useState([]);
    const [empCat, setEmpCat] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/admin/categories"
                );
                const data = await response.json();
                if (data.success) {
                    setCategories(data.data);
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        category: data.message || "Failed to load categories.",
                    }));
                }
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    category: "Error fetching categories.",
                }));
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (category) {
            const fetchIssueCategories = async () => {
                try {
                    const endpoint =
                        category === "1"
                            ? "http://127.0.0.1:8000/api/incident-categories"
                            : category === "2"
                            ? "http://127.0.0.1:8000/api/request-categories"
                            : null;

                    if (!endpoint) return;

                    const response = await fetch(endpoint);
                    const data = await response.json();
                    if (data) {
                        setIssueCategories(data || []);
                    } else {
                        setIssueCategories([]);
                        setErrors((prev) => ({
                            ...prev,
                            empCat: "No issue categories available.",
                        }));
                    }
                } catch (error) {
                    setIssueCategories([]);
                    setErrors((prev) => ({
                        ...prev,
                        empCat: "Error fetching issue categories.",
                    }));
                }
            };

            fetchIssueCategories();
        } else {
            setIssueCategories([]);
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newErrors = {};
        if (!name) newErrors.name = "Name is required.";
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (
            !/\S+@\S+\.\S+/.test(email) ||
            !email.endsWith("@fidelisgroup.in")
        ) {
            newErrors.email =
                "The email is not in the allowed list. Enter your valid mail.";
        }
        if (!category) newErrors.category = "Category is required.";
        if (!priority) newErrors.priority = "Priority is required.";
        if (!empCat) newErrors.empCat = "Subcategory is required.";
        if (!message) newErrors.message = "Message is required.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    category,
                    priority,
                    emp_cat: empCat,
                    message,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to create ticket. Status: ${response.status}`
                );
            }

            const data = await response.json();
            if (data.success) {
                navigate("/ticket-submitted", {
                    state: { ticketId: data.data.trackid },
                });
            } else {
                setErrors((prev) => ({
                    ...prev,
                    form: data.message || "Error creating ticket.",
                }));
            }
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                form: "An error occurred while creating the ticket.",
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="w-full bg-white shadow-md">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    <Link to="/">
                        <img
                            src="/images/fidelis-logo.png"
                            alt="Fidelis Logo"
                            className="h-16"
                        />
                    </Link>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                <h2 className="text-3xl font-semibold text-[#133e5e] mb-6 text-center">
                    Submit a Support Request
                </h2>
                <div className="flex flex-wrap bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
                    {/* Left Section with Form */}
                    <div className="w-full md:w-1/2 flex flex-col items-start justify-start p-8 space-y-6">
                        <form
                            onSubmit={handleSubmit}
                            className="w-full bg-white p-4 space-y-6"
                        >
                            {/* Name Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="name"
                                    className="block text-xl font-medium text-[#133e5e] mb-2"
                                >
                                    Name
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && (
                                    <div className="text-red-500 mt-2">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="email"
                                    className="block text-xl font-medium text-[#133e5e] mb-2"
                                >
                                    Email
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-red-500 mt-2">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Ticket Type Radio Buttons */}
                            <div className="mb-6">
                                <label
                                    htmlFor="category"
                                    className="block text-xl font-medium text-[#133e5e] mb-2"
                                >
                                    Ticket Type{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-4">
                                    {categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="radio"
                                                id={`category-${cat.id}`}
                                                name="category"
                                                value={cat.id}
                                                checked={category === cat.id}
                                                onChange={(e) =>
                                                    setCategory(e.target.value)
                                                }
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <label
                                                htmlFor={`category-${cat.id}`}
                                                className="ml-2 text-lg text-gray-700"
                                            >
                                                {cat.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.category && (
                                    <div className="text-red-500 mt-2">
                                        {errors.category}
                                    </div>
                                )}
                            </div>

                            {/* Subcategory Dropdown */}
                            <div className="mb-6">
                                <label
                                    htmlFor="empCat"
                                    className="block text-xl font-medium text-[#133e5e] mb-2"
                                >
                                    Subcategory
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="empCat"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    value={empCat}
                                    onChange={(e) => setEmpCat(e.target.value)}
                                >
                                    <option value="">
                                        Select a subcategory
                                    </option>
                                    {issueCategories.map((issueCat) => (
                                        <option
                                            key={issueCat.id}
                                            value={issueCat.id}
                                        >
                                            {issueCat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.empCat && (
                                    <div className="text-red-500 mt-2">
                                        {errors.empCat}
                                    </div>
                                )}
                            </div>

                            {/* Priority Radio Buttons */}
                            <div className="mb-6">
                                <label
                                    htmlFor="priority"
                                    className="block text-xl font-medium text-[#133e5e] mb-2"
                                >
                                    Priority{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex space-x-6">
                                    {[
                                        { value: "0", label: "Low" },
                                        { value: "1", label: "Medium" },
                                        { value: "2", label: "High" },
                                    ].map((priorityOption) => (
                                        <div
                                            key={priorityOption.value}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="radio"
                                                id={`priority-${priorityOption.value}`}
                                                name="priority"
                                                value={priorityOption.value}
                                                checked={
                                                    priority ===
                                                    priorityOption.value
                                                }
                                                onChange={(e) =>
                                                    setPriority(e.target.value)
                                                }
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <label
                                                htmlFor={`priority-${priorityOption.value}`}
                                                className="ml-2 text-lg text-gray-700"
                                            >
                                                {priorityOption.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.priority && (
                                    <div className="text-red-500 mt-2">
                                        {errors.priority}
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="message"
                                    className="block text-xl font-medium text-[#133e5e] mb-2"
                                >
                                    Message
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    placeholder="Enter you issue here in detail"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                {errors.message && (
                                    <div className="text-red-500 mt-2">
                                        {errors.message}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="mb-6 flex justify-center">
                                <button
                                    type="submit"
                                    className="px-6 py-3 w-full bg-gradient-to-r from-[#133e5e] to-[#f8703c] text-white text-lg rounded-md hover:bg-gradient-to-l transition-all"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Create Ticket"}
                                </button>
                            </div>

                            {errors.form && (
                                <div className="text-red-500 mt-4">
                                    {errors.form}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Section with Image */}
                    {/* Right Section with Sticky Image Scrolling Along with Form */}
                    <div className="w-full md:w-1/2 flex justify-center items-start sticky top-[160px] bottom-0 self-start">
                        <img
                            src="/images/ticketimage.jpg"
                            alt="Create Ticket"
                            className="w-full h-full object-cover mix-blend-multiply"
                        />
                    </div>
                </div>
            </main>

            <footer className="bg-[#133e5e] text-white py-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>
                    <p>&copy; {new Date().getFullYear()} Fidelis Technologies. All Rights Reserved.</p>
                    </p>
                </div>
            </footer>
        </div>
    );
}
