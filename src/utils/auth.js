import { auth } from "./firebase";  
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
  
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const gmailAccessToken = credential?.accessToken; // ✅ Get access token
      console.log("📧 Gmail API Access Token:", gmailAccessToken);
  
      return gmailAccessToken;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };
  

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

export const getCurrentUser = () => {
    const user = auth.currentUser;
    console.log("Current User:", user);  
    return user;
};
