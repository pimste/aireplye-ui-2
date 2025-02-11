import { auth } from "./firebase";

export const fetchEmails = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");
    
    // ✅ Get OAuth token correctly
    const token = await user.getIdToken();
    console.log("Using OAuth Token:", token);

    if (!token) throw new Error("Invalid OAuth access token.");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=newer_than:1d",
      { method: "GET", headers }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Gmail API Error: ${response.status} - ${errorMessage}`);
      throw new Error("Failed to fetch emails.");
    }

    const data = await response.json();
    console.log("Gmail API Response:", data);

    if (!data.messages) return [];

    return await Promise.all(
      data.messages.map(async (message) => {
        const emailResponse = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          { method: "GET", headers }
        );

        if (!emailResponse.ok) {
          throw new Error(`Failed to fetch email ID ${message.id}`);
        }

        const emailData = await emailResponse.json();
        const subject = emailData.payload.headers.find(h => h.name === "Subject")?.value || "(No Subject)";
        const from = emailData.payload.headers.find(h => h.name === "From")?.value || "Unknown";

        return { id: message.id, subject, from, snippet: emailData.snippet || "No preview available" };
      })
    );
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
};
