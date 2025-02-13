import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Logged in user:", user);  // Debug logged-in user object
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-10 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Login to AIReplye</h1>
        <button 
          onClick={handleLogin} 
          className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
