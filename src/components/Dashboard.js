import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchEmails } from "../utils/fetchEmails";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmails = async () => {
      if (!user) return; 
      try {
        const fetchedEmails = await fetchEmails();
        console.log("Fetched Emails:", fetchedEmails);
        setEmails(fetchedEmails);
      } catch (err) {
        setError("Failed to load emails. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setLoading(true);
      loadEmails();
    }
  }, [user]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.displayName} 👋</h1>
        <button 
          onClick={logout} 
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading emails...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📩 Latest Emails</h2>
        <div className="space-y-4">
          {emails.length === 0 && !loading && (
            <p className="text-center text-gray-500">No emails found :/.</p>
          )}
          {emails.map((email) => (
            <div key={email.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-medium">{email.subject}</h3>
              <p className="text-sm text-gray-600">From: {email.from}</p>
              <p className="text-sm text-gray-500">{email.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
