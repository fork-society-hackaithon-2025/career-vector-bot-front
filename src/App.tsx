import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import CataloguePage from "./pages/client/CataloguePage";
import CartPage from "./pages/client/CartPage";
import CheckoutPage from "./pages/client/CheckoutPage";
import OrderConfirmationPage from "./pages/client/OrderConfirmationPage";
import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import MerchantProducts from "./pages/merchant/MerchantProducts";
import MerchantOrders from "./pages/merchant/MerchantOrders";
import MerchantAnalytics from "./pages/merchant/MerchantAnalytics";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MerchantRoute from "./components/auth/MerchantRoute";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Routes>
                <Route element={<Layout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Client Routes */}
                  <Route path="/catalogue" element={
                    <ProtectedRoute>
                      <CataloguePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-confirmation" element={
                    <ProtectedRoute>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  } />

                  {/* Merchant Routes */}
                  <Route path="/merchant" element={
                    <MerchantRoute>
                      <MerchantDashboard />
                    </MerchantRoute>
                  } />
                  <Route path="/merchant/products" element={
                    <MerchantRoute>
                      <MerchantProducts />
                    </MerchantRoute>
                  } />
                  <Route path="/merchant/orders" element={
                    <MerchantRoute>
                      <MerchantOrders />
                    </MerchantRoute>
                  } />
                  <Route path="/merchant/analytics" element={
                    <MerchantRoute>
                      <MerchantAnalytics />
                    </MerchantRoute>
                  } />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </HashRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
