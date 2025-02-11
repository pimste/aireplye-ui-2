import { auth } from "./firebase"; 
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(); 
      return token;
    } catch (error) {
      console.error("Login Error:", error.message);
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
    console.log("Current User:", user);  // Debugging if user is authenticated
    return user;
  };
