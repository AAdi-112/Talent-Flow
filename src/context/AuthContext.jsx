// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    console.log("[AuthContext] login attempt:", { email, password });

    try {
      const res = await fetch("/api/users");
      const users = await res.json();
      console.log("[AuthContext] fetched users:", users);

      const found = users.find(
        (u) => u.email === email && u.password === password
      );

      if (found) {
        console.log("[AuthContext] login success:", found);
        setUser({ role: found.role, email: found.email });
        return true;
      } else {
        console.warn("[AuthContext] login failed: invalid credentials");
        setError("Invalid email or password");
        return false;
      }
    } catch (err) {
      console.error("[AuthContext] login error:", err);
      setError("Server error. Please try again.");
      return false;
    }
  };

  const logout = () => {
    console.log("[AuthContext] logging out user:", user);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
