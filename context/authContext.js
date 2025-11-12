"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("Invalid token format");
      const payload = JSON.parse(atob(parts[1]));
      queueMicrotask(() => setUser(payload));
    } catch {
      console.warn("Invalid token found, clearing storage.");
      localStorage.removeItem("token");
    }
  }, []);

  const login = (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    try {
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("Invalid token format");
      const payload = JSON.parse(atob(parts[1]));
      setUser(payload);
    } catch {
      console.warn("Failed to parse token during login");
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
