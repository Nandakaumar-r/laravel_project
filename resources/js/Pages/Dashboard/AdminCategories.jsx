import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    priority: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
   // Map priority value to name
   const priorityMap = {
    "0": "Low",
    "1": "Medium",
    "2": "High",
    // Add more mappings if needed
  };
  const autoassign ={
    "0": "OFF",
    "1": "ON",
  }
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/admin/categories")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("API response does not contain category data as an array.");
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleAddCategory = () => {
    axios
      .post("http://127.0.0.1:8000/api/admin/categories/", newCategory)
      .then((response) => {
        if (response.data && response.data.success) {
          const newCategoryData = response.data.data;
          setCategories((prevCategories) => [...prevCategories, newCategoryData]);
          setShowAddCategoryModal(false);
          setNewCategory({
            name: "",
            priority: "",
          });
          setSuccessMessage("Category added successfully!"); // Set success message
          setTimeout(() => setSuccessMessage(""), 2000); // Hide after 2 seconds
        }
      })
      .catch((error) => {
        console.error("Error adding category:", error);
        alert("There was an error adding the category.");
      });
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = () => {
    axios
      .put(`http://127.0.0.1:8000/api/admin/categories/${editingCategory.id}`, editingCategory)
      .then((response) => {
        // Ensure we are updating the categories list correctly
        const updatedCategory = response.data.data; // Assuming response contains the updated category
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
        setShowEditCategoryModal(false);
        setSuccessMessage("Category updated successfully!"); // Set success message
        setTimeout(() => setSuccessMessage(""), 2000); // Hide after 2 seconds
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        alert("Error updating category");
      });
  };
  

  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    axios
      .delete(`http://127.0.0.1:8000/api/admin/categories/${id}`)
      .catch((error) => {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
        setCategories(categories);
      });
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

        {/* Button to Open Add Category Modal */}
        <button
          onClick={() => setShowAddCategoryModal(true)}
          className="bg-[#f8703c] text-white px-6 py-2 rounded-md mb-6 hover:bg-orange-600 transition duration-300"
        >
          Add New Category
        </button>

        {/* Categories Table */}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#f8703c] text-white">
              <th className="px-6 py-3 text-center font-semibold">ID</th>
              <th className="px-6 py-3 text-center font-semibold">Category Name</th>
              <th className="px-6 py-3 text-center font-semibold">Priority</th>
              <th className="px-6 py-3 text-center font-semibold">Autoassign</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">{category.id}</td>
                  <td className="px-6 py-4 text-center">{category.name}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{priorityMap[category.priority] || "N/A"}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{autoassign[category.autoassign] || "N/A"}</td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 bg-[#f8703c]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-semibold mb-6 text-[#f8703c]">Add New Category</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Priority</label>
                <input
                  type="text"
                  placeholder="Priority"
                  value={newCategory.priority}
                  onChange={(e) => setNewCategory({ ...newCategory, priority: e.target.value })}
                  className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleAddCategory}
                  className="bg-[#f8703c] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition duration-300"
                >
                  Add Category
                </button>
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditCategoryModal && editingCategory && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-semibold mb-6 text-[#f8703c]">Edit Category</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Priority</label>
                <input
                  type="text"
                  value={editingCategory.priority}
                  onChange={(e) => setEditingCategory({ ...editingCategory, priority: e.target.value })}
                  className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleUpdateCategory}
                  className="bg-[#f8703c] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition duration-300"
                >
                  Update Category
                </button>
                <button
                  onClick={() => setShowEditCategoryModal(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {successMessage && (
          <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-md shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </Layout>
  );
}
