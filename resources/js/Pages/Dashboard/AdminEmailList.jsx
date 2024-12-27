import React, { useState, useEffect } from "react";
import Layout from "./Layout";

export default function AdminEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [csvFile, setCsvFile] = useState(null); // File state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Modal state for import
  const [importSuccess, setImportSuccess] = useState(null); // Success message state for import

  // Utility function to safely parse JSON
  const safeParseJSON = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.warn("Failed to parse JSON:", text);
      return null; // Return null if JSON parsing fails
    }
  };

  // Fetch emails from the API
  const fetchEmails = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/emails");
      if (response.ok) {
        const result = await safeParseJSON(response);
        if (result) {
          setEmails(result);
        } else {
          setError("Invalid response format from server.");
        }
      } else {
        setError("Failed to fetch emails.");
      }
    } catch (error) {
      setError("An error occurred while fetching emails.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Handle lock toggle
  const handleToggleLock = async (email) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/email-list/${email.id}/lock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lock: !email.lock }), // Toggling lock
      });

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        alert(`Failed to toggle lock: ${errorData?.message || "Unknown error"}`);
      } else {
        // After the lock toggle, re-fetch the emails to update the lock status
        fetchEmails();
      }
    } catch (error) {
      console.error("Error toggling lock:", error);
      alert("An error occurred while toggling the lock.");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // Handle email import
  const handleImportEmails = async () => {
    if (!csvFile) {
      setImportError("Please select a CSV file to import.");
      return;
    }

    setImporting(true);
    setImportError(null);
    setImportSuccess(null); // Clear previous success messages

    const formData = new FormData();
    formData.append("csv_file", csvFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/import-emails", {
        method: "POST",
        body: formData,
      });

      const result = await safeParseJSON(response);

      if (response.ok && result) {
        if (result.inserted || result.duplicates) {
          const { inserted, duplicates } = result;

          setImportSuccess(
            `Import successful! ${inserted} emails inserted, ${duplicates.length} duplicates found.`
          );

          // Show success message for 4-5 seconds
          setTimeout(() => {
            // Reset modal state and close
            setIsImportModalOpen(false);
            setCsvFile(null); // Reset the file input
            setImportSuccess(null); // Clear success message
          }, 4000); // 4 seconds delay before closing modal

          // Re-fetch emails after import
          const fetchResponse = await fetch("http://127.0.0.1:8000/api/admin/emails");
          if (fetchResponse.ok) {
            const updatedEmails = await safeParseJSON(fetchResponse);
            if (updatedEmails) {
              setEmails(updatedEmails);
            } else {
              setImportError("Invalid response format while fetching updated emails.");
            }
          } else {
            setImportError("Failed to fetch updated emails.");
          }
        } else {
          setImportError("Failed to import emails. Please check the CSV file format.");
        }
      } else {
        setImportError("Invalid CSV headers. Expected: email.");
      }
    } catch (error) {
      console.error("Error importing emails:", error);
      setImportError("An error occurred while importing emails.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto py-12 px-6">
          <h2 className="text-3xl font-semibold text-center mb-6">Fidelis Employees Emails</h2>

          {loading ? (
            <p className="text-center text-gray-500 text-lg">Loading emails...</p>
          ) : error ? (
            <p className="text-center text-red-500 text-lg">{error}</p>
          ) : emails.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
              <table className="w-full table-auto text-gray-700">
                <thead className="sticky top-0 bg-[#f8703c] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Created On</th>
                    <th className="px-6 py-3 text-left">Lock Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto max-h-[60vh]">
                  {emails
                    .sort((a, b) => a.id - b.id) // Sort by ID in ascending order
                    .map((email) => (
                      <tr key={email.id} className="border-b hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4">{email.id}</td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">{email.email}</td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">{email.created_at}</td>
                        <td className="px-6 py-4">
                          {email.lock ? (
                            <strong><span className="text-red-600">Locked</span></strong>
                          ) : (
                            <strong><span className="text-green-600">Unlocked</span></strong>
                          )}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => handleToggleLock(email)}
                            className={`px-4 py-2 rounded transition duration-300 ease-in-out ${email.lock ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                          >
                            {email.lock ? "Unlock" : "Lock"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">No emails found in the Database. Please Import emails.</p>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-6 py-3 bg-[#f8703c] text-white rounded hover:bg-green-400 transition duration-300 ease-in-out"
            >
              Import Emails
            </button>
            {importError && <p className="text-red-500 text-lg mt-2">{importError}</p>}
          </div>
        </main>

        {/* Import Modal */}
        {isImportModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold text-center mb-4">Import Emails</h3>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mb-4"
              />

              {importError && (
                <p className="text-red-500 text-lg mb-4 text-center">{importError}</p>
              )}

              {importSuccess && (
                <p className="text-green-500 text-lg mb-4 text-center">{importSuccess}</p>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleImportEmails}
                  className="px-4 py-2 bg-[#f8703c] text-white rounded hover:bg-[#e56f2b] transition duration-300 ease-in-out"
                  disabled={importing}
                >
                  {importing ? "Importing..." : "Import"}
                </button>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300 ease-in-out"
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
