import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchEmails } from "../utils/fetchEmails"; // Fetch emails utility

const EmailContext = createContext();

export const useEmail = () => useContext(EmailContext);

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmails = async () => {
      setLoading(true);
      try {
        const emails = await fetchEmails();
        setEmails(emails);
      } catch (error) {
        setError("Failed to load emails.");
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, []);  // Ensure emails are loaded once on mount

  return (
    <EmailContext.Provider value={{ emails, loading, error }}>
      {children}
    </EmailContext.Provider>
  );
};
