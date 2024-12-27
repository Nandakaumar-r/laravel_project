import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        user: "",
        pass: "",
        isadmin: "0",
        name: "",
        email: "",
        signature: "Best Regards",
        categories: "1",
    });
    const [editingUser, setEditingUser] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });


    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/admin/hesk-users/")
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    setUsers(response.data.data);
                } else {
                    console.error(
                        "API response does not contain user data as an array."
                    );
                }
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleAddUser = () => {
        axios
            .post("http://127.0.0.1:8000/api/admin/hesk-users/", newUser)
            .then((response) => {
                if (response.data && response.data.success) {
                    const newUserData = response.data.data;
                    setUsers((prevUsers) => [...prevUsers, newUserData]);
                    setShowAddUserModal(false);
                    setNewUser({
                        user: "",
                        pass: "",
                        isadmin: "0",
                        name: "",
                        email: "",
                        signature: "Best Regards",
                        categories: "1",
                    });
                    showNotification("User added successfully!", "success");
                }
            })
            .catch((error) => {
                console.error("Error adding user:", error);
                showNotification(
                    "There was an error adding the user.",
                    "error"
                );
            });
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditUserModal(true);
    };

    const handleUpdateUser = () => {
        axios
            .put(
                `http://127.0.0.1:8000/api/admin/hesk-users/${editingUser.id}`,
                editingUser
            )
            .then((response) => {
                const updatedUser = response.data;
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    )
                );
                setShowEditUserModal(false);
                showNotification("User updated successfully!", "success");
            })
            .catch((error) => {
                console.error("Error updating user:", error);
                showNotification("Error updating user", "error");
            });
    };

    const handleDeleteUser = (id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete the user?");
        
        if (userConfirmed) {
          axios
            .delete(`http://127.0.0.1:8000/api/admin/hesk-users/${id}`)
            .then(() => {
              // Update users state to remove the deleted user
              setUsers(users.filter((user) => user.id !== id));
              showNotification("User deleted successfully!", "success");
            })
            .catch((error) => {
              console.error("Error deleting user:", error);
              showNotification("Error deleting user", "error");
            });
        }
      };
      

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: "", type: "" });
        }, 3000); // Clear notification after 3 seconds
    };
    const getAdminStatus = (isadmin) => (isadmin === "1" ? "Admin" : "Staff");

    const getCategoryName = (category) =>
        category === "1" ? "Submit an Incident" : "Submit a Request";

    return (
        <Layout>
            {/* Notification Popup */}
            {notification.message && (
                <div
                    className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white ${
                        notification.type === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                    }`}
                    style={{ zIndex: 9999 }}
                >
                    {notification.message}
                </div>
            )}
            <div className="p-6 rounded-lg">
                <h1 className="text-2xl font-semibold mb-4 p-2 rounded-md">
                    Manage Users
                </h1>

                {/* Button to Open Add User Modal */}
                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-[#f8703c] text-white px-4 py-2 rounded-md mb-6"
                >
                    Add New User
                </button>

                {/* Users Table */}
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-[#f8703c] text-white">
                        <tr className="border-b">
                            <th className="px-4 py-2 text-center">ID</th>
                            <th className="px-4 py-2 text-center">Username</th>
                            <th className="px-4 py-2 text-center">Name</th>
                            <th className="px-4 py-2 text-center">Email</th>
                            <th className="px-4 py-2 text-center">
                                Admin Status
                            </th>
                            <th className="px-4 py-2 text-center">Category</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-2 text-center">
                                        {user.id}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {user.user}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {getAdminStatus(user.isadmin)}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {getCategoryName(user.categories)}
                                    </td>
                                    <td className="px-4 py-2 text-center flex gap-2">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="bg-[#f8703c] text-white px-4 py-2 rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteUser(user.id)
                                            }
                                            className="bg-[#ff0000] text-white px-4 py-2 rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-2 text-center text-gray-500"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {showAddUserModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                            <h2 className="text-xl font-semibold mb-4 p-2 rounded-md">
                                Add New User
                            </h2>
                            <div className="mb-4">
                                <label
                                    htmlFor="user"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="user"
                                    placeholder="Username"
                                    value={newUser.user}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            user: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="pass"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="pass"
                                    placeholder="Password"
                                    value={newUser.pass}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            pass: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Name"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            name: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4 hidden">
                                <label
                                    htmlFor="signature"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Signature
                                </label>
                                <input
                                    type="text"
                                    id="signature"
                                    placeholder="Signature"
                                    value={newUser.signature}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            signature: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4 hidden">
                                <label
                                    htmlFor="categories"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category
                                </label>
                                <select
                                    id="categories"
                                    value={newUser.categories}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            categories: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                >
                                    <option value="1">
                                        Submit an Incident
                                    </option>
                                    <option value="2">Submit a Request</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="isadmin"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Admin Status
                                </label>
                                <select
                                    id="isadmin"
                                    value={newUser.isadmin}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            isadmin: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                >
                                    <option value="0">Staff</option>
                                    <option value="1">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleAddUser}
                                    className="bg-[#f8703c] text-white px-4 py-2 rounded-md"
                                >
                                    Add User
                                </button>
                                <button
                                    onClick={() => setShowAddUserModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {/* Edit User Modal */}
                {showEditUserModal && editingUser && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-96">
                            <h2 className="text-xl font-semibold mb-4 p-2 rounded-md">
                                Edit User
                            </h2>
                            <div className="mb-4">
                                <label
                                    htmlFor="edit-user"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="edit-user"
                                    value={editingUser.user}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            user: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="edit-pass"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="edit-pass"
                                    value={editingUser.pass}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            pass: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="edit-name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="edit-name"
                                    value={editingUser.name}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            name: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="edit-email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="edit-email"
                                    value={editingUser.email}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4 hidden">
                                <label
                                    htmlFor="edit-signature"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Signature
                                </label>
                                <input
                                    type="text"
                                    id="edit-signature"
                                    value={editingUser.signature}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            signature: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4 hidden">
                                <label
                                    htmlFor="edit-categories"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category
                                </label>
                                <select
                                    id="edit-categories"
                                    value={editingUser.categories}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            categories: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                >
                                    <option value="1">
                                        Submit an Incident
                                    </option>
                                    <option value="2">Submit a Request</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="edit-isadmin"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Admin Status
                                </label>
                                <select
                                    id="edit-isadmin"
                                    value={editingUser.isadmin}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            isadmin: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded-md w-full"
                                >
                                    <option value="0">Staff</option>
                                    <option value="1">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleUpdateUser}
                                    className="bg-[#f8703c] text-white px-4 py-2 rounded-md"
                                >
                                    Update User
                                </button>
                                <button
                                    onClick={() => setShowEditUserModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
