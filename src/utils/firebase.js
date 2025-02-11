import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCvqjPgUdUrGsI7Hpnxb3Y3NwrCQyy2GyA",
  authDomain: "aireplye-c3f0c.firebaseapp.com",
  projectId: "aireplye-c3f0c",
  storageBucket: "aireplye-c3f0c.firebasestorage.app",
  messagingSenderId: "75277722596",
  appId: "1:75277722596:web:dc0148f1622f84e6171df1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = true; 

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/gmail.readonly");

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/gmail.readonly");

    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken(/* forceRefresh */ true);  // ✅ Force new token
    return token;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};



export { auth, signInWithGoogle };
