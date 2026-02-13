import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Use environment variable with fallback
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://event-platform-backend.onrender.com";

  console.log("🔗 Connecting to API:", API_URL);
  console.log("🔍 Environment check:", process.env.REACT_APP_API_URL);

  // Set axios default header
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      console.log("🔄 Loading user...");
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data);
      console.log("✅ User loaded:", response.data.email);
    } catch (error) {
      console.error(
        "❌ Error loading user:",
        error.response?.data || error.message
      );
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      console.log("🔄 Registering user...");
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        userData
      );
      const { token, ...user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      toast.success("Registration successful!");
      console.log("✅ Registration successful");
      return true;
    } catch (error) {
      console.error(
        "❌ Registration error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      console.log("🔄 Logging in...");
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        credentials
      );
      const { token, ...user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      toast.success("Login successful!");
      console.log("✅ Login successful");
      return true;
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    console.log("✅ Logged out");
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    API_URL,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
