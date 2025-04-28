import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/common/api";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => void;
  isMerchant: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("telegramShopUser");
    const storedToken = localStorage.getItem("jwtToken");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        api.setAuthToken(storedToken);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("telegramShopUser");
        localStorage.removeItem("jwtToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: User, jwt: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem("telegramShopUser", JSON.stringify(userData));
      localStorage.setItem("jwtToken", jwt);

      setUser(userData);
      setToken(jwt);
      api.setAuthToken(jwt);

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
    setToken(null);
    localStorage.removeItem("telegramShopUser");
    localStorage.removeItem("jwtToken");
    api.setAuthToken("");
    toast.info("You have been logged out.");
  };

  const isMerchant = () => {
    return user?.role === "ADMIN";
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isMerchant }}>
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
