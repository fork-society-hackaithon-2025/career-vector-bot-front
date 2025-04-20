import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Types
export interface User {
  id: string;
  name: string;
  role: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  isMerchant: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("telegramShopUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("telegramShopUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: User) => {
    setIsLoading(true);
    try {
      console.log(userData);
      setUser(userData);
      localStorage.setItem("telegramShopUser", JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("telegramShopUser");
    toast.info("You have been logged out.");
  };

  const isMerchant = () => {
    return user?.role === "ADMIN";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isMerchant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
