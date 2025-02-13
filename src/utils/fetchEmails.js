import { auth } from "./firebase"; 

export const fetchEmails = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ User not authenticated");
      throw new Error("User not authenticated.");
    }

    // 🔹 Get Firebase Auth Token
    const token = await user.getIdToken(true); // Force refresh token
    console.log("🔑 Firebase Token:", token);

    // 🔹 Send request with Authorization header
    const response = await fetch("https://us-central1-aireplye-449819.cloudfunctions.net/fetchEmails", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // ✅ Include token
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`❌ Backend API Error: ${response.status} - ${errorMessage}`);
      throw new Error("Failed to fetch emails.");
    }

    const data = await response.json();
    console.log("✅ Backend API Response:", data);
    return data.emails || [];
  } catch (error) {
    console.error("❌ Error fetching emails:", error.message);
    return [];
  }
};
