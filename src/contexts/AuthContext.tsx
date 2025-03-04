
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Types
export interface User {
  id: string;
  name: string;
  role: "client" | "merchant";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  isMerchant: () => boolean;
}

// Mock user data (would come from API/database in real implementation)
const MOCK_USERS = [
  { id: "1", name: "Client User", username: "client", password: "client123", role: "client" as const },
  { id: "2", name: "Merchant User", username: "merchant", password: "merchant123", role: "merchant" as const },
];

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

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = MOCK_USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
      };
      
      setUser(userData);
      localStorage.setItem("telegramShopUser", JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
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
    return user?.role === "merchant";
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
