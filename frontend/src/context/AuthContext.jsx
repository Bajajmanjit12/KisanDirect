import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "kisandirect-users";
const CURRENT_USER_KEY = "kisandirect-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const register = ({ name, email, password, role }) => {
    const existingUsers = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const alreadyExists = existingUsers.some(
      (existingUser) =>
        existingUser.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyExists) {
      throw new Error("An account with this email already exists");
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
    };

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    setUser(newUser);

    return newUser;
  };

  const login = ({ email, password }) => {
    const existingUsers = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const foundUser = existingUsers.find(
      (existingUser) =>
        existingUser.email.toLowerCase() === email.toLowerCase() &&
        existingUser.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
    setUser(foundUser);

    return foundUser;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const value = {
    user,
    isLoggedIn: Boolean(user),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}