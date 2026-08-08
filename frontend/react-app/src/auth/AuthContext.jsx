// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // On fresh load, read from localStorage (user who is already logged in)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");

    if (!saved || saved === "undefined") {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    } //if get saved data (user's logged in info: otherwise return null)
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); //remove user's info: from memory
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
