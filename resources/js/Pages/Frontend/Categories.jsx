import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/admin/categories");
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setCategories(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryName) => {
    navigate("/create-ticket", { state: { categoryName } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <img
            src="/images/fidelis-logo.png"
            alt="Fidelis Logo"
            className="h-12"
          />
          <nav>
            <Link to="/" className="text-blue-600 text-sm hover:underline">
              Helpdesk &gt; Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-12 px-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Select a Category to Create a Ticket
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => handleCategorySelect(category.name)}
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  Priority: {category.priority}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories found</p>
        )}
      </main>
    </div>
  );
}
