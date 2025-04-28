import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isMerchant = user?.role === 'ADMIN';
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar isMerchant={isMerchant} />
      
      <main className="flex-1">
        <div className="container px-4 pt-4 pb-20 mx-auto">
          <Outlet />
        </div>
      </main>
      
      {user && (
        <MobileNavbar isMerchant={isMerchant} />
      )}
    </div>
  );
};

export default Layout;
