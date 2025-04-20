import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto text-center space-y-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold">Добро пожаловать!</h1>
        <p className="text-muted-foreground text-lg">
          {user ? `Здравствуйте, ${user.name}!` : "Пожалуйста, войдите в аккаунт через Telegram"}
        </p>

        <div className="grid gap-4 mt-8">
          {user?.role === "USER" && (
            <Button 
              size="lg" 
              className="w-full text-lg h-14"
              onClick={() => navigate("/catalogue")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Products
            </Button>
          )}
          
          {user?.role === "ADMIN" && (
            <Button 
              size="lg" 
              className="w-full text-lg h-14"
              onClick={() => navigate("/merchant/dashboard")}
            >
              <LineChart className="mr-2 h-5 w-5" />
              Merchant Dashboard
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
