import { auth, signInWithGoogle } from "./firebase";

export const fetchEmails = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated.");
    }

    // Get the correct OAuth token
    const token = await signInWithGoogle();
    console.log("Using OAuth Access Token:", token);

    if (!token) {
      throw new Error("Failed to get a valid OAuth access token.");
    }

    // Fetch emails from Gmail API
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error fetching emails: ${response.statusText} - ${errorMessage}`);
      throw new Error("Failed to fetch emails.");
    }

    const data = await response.json();
    console.log("Gmail API Response:", data);

    if (!data.messages) {
      console.warn("No messages found in inbox.");
      return [];
    }

    const emails = await Promise.all(
      data.messages.map(async (message) => {
        const emailResponse = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
            },
          }
        );

        const emailData = await emailResponse.json();
        console.log("Fetched Email Data:", emailData);

        const subjectHeader = emailData.payload.headers.find(
          (header) => header.name === "Subject"
        );

        return {
          id: message.id,
          subject: subjectHeader ? subjectHeader.value : "(No Subject)",
          from: emailData.payload.headers.find((h) => h.name === "From")?.value || "Unknown",
          snippet: emailData.snippet || "No preview available",
        };
      })
    );

    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
};
