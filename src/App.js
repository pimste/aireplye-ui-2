import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Import `useAuth`
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  console.log("User from AppRoutes:", user);

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Login />} />
    </Routes>
  );
}

export default App;
