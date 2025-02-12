import { auth } from "./firebase"; 

export const fetchEmails = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated.");
    }

    const token = await user.getIdToken(/* forceRefresh */ true);
    console.log("Using Firebase Token:", token);

    const response = await fetch("https://us-central1-aireplye-449819.cloudfunctions.net/fetchEmails", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Backend API Error: ${response.status} - ${errorMessage}`);
      throw new Error("Failed to fetch emails.");
    }

    const data = await response.json();
    console.log("Backend API Response:", data);
    return data.messages || [];
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
};
