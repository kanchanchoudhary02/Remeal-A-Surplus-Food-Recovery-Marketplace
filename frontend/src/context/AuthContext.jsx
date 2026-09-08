// context/AuthContext.jsx
// Ye poore app ki "global memory" hai — kaun login hai, uska data kya hai.

import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

// 1. Context banao (khali box, jisme baad me value daalenge)
const AuthContext = createContext();

// 2. Provider component — ye poore App ko wrap karega taaki har child
//    component isse "user" aur "token" padh sake
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // page reload pe check karne ke liye

  // App load hote hi check karo — pehle se koi token/user localStorage me saved hai kya?
  // (jaise: browser refresh kiya, to login state khoni nahi chahiye)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login/Register success hone pe ye function call hoga
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook — isse har component me easily context use kar sakte hain
//    "useAuth()" likhna "useContext(AuthContext)" se chota aur clean hai
export const useAuth = () => useContext(AuthContext);