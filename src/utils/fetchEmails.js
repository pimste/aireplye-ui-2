import { auth } from "./firebase";
import { signInWithGoogle } from "./auth";
import { GoogleAuthProvider } from "firebase/auth";

export const fetchEmails = async () => {
  try {
    let user = auth.currentUser;

    if (!user) {
      console.error("❌ No authenticated user, signing in...");
      user = await signInWithGoogle();
    }

    // 🔹 Get Firebase Auth Token
    const firebaseToken = await user.getIdToken(true);
    console.log("🔑 Firebase Token:", firebaseToken);

    // 🔹 Ensure Google Sign-In
    const providerData = user.providerData.find((p) => p.providerId === "google.com");
    if (!providerData) {
      console.error("❌ No Google OAuth credential found.");
      throw new Error("Google Sign-In required.");
    }

    // 🔹 Retrieve Gmail API Access Token
    const credential = GoogleAuthProvider.credentialFromResult(user);
    const gmailAccessToken = credential?.accessToken;

    if (!gmailAccessToken) {
      console.error("❌ Missing Gmail access token.");
      throw new Error("Missing Gmail access token.");
    }

    console.log("📧 Gmail API Access Token:", gmailAccessToken);

    // 🔹 Send request with both tokens
    const response = await fetch("https://us-central1-aireplye-449819.cloudfunctions.net/api/fetchEmails", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${firebaseToken}`, // Firebase Auth Token
        "gmail-access-token": gmailAccessToken, // ✅ Gmail API Token
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
    return data.messages || [];
  } catch (error) {
    console.error("❌ Error fetching emails:", error.message);
    return [];
  }
};
