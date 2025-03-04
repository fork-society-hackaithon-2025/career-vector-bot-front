
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  hasCartTimeExpired: boolean;
  cartEditDeadline: Date | null;
  setCartEditDeadline: (date: Date | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartEditDeadline, setCartEditDeadline] = useState<Date | null>(null);
  const [hasCartTimeExpired, setHasCartTimeExpired] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("telegramShopCart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse stored cart:", error);
      }
    }
    
    const storedDeadline = localStorage.getItem("telegramShopCartDeadline");
    if (storedDeadline) {
      try {
        const deadline = new Date(storedDeadline);
        setCartEditDeadline(deadline);
      } catch (error) {
        console.error("Failed to parse stored deadline:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("telegramShopCart", JSON.stringify(items));
  }, [items]);

  // Save deadline to localStorage whenever it changes
  useEffect(() => {
    if (cartEditDeadline) {
      localStorage.setItem("telegramShopCartDeadline", cartEditDeadline.toISOString());
    } else {
      localStorage.removeItem("telegramShopCartDeadline");
    }
  }, [cartEditDeadline]);

  // Check if cart edit time has expired
  useEffect(() => {
    if (!cartEditDeadline) {
      setHasCartTimeExpired(false);
      return;
    }

    const checkExpiration = () => {
      if (cartEditDeadline && new Date() > cartEditDeadline) {
        setHasCartTimeExpired(true);
      } else {
        setHasCartTimeExpired(false);
      }
    };

    // Check immediately
    checkExpiration();

    // Then check every minute
    const interval = setInterval(checkExpiration, 60000);
    
    return () => clearInterval(interval);
  }, [cartEditDeadline]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCartEditDeadline(null);
    setHasCartTimeExpired(false);
    toast.info("Cart has been cleared");
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice,
      hasCartTimeExpired,
      cartEditDeadline,
      setCartEditDeadline
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
