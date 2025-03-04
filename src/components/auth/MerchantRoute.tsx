
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MerchantRouteProps {
  children: React.ReactNode;
}

const MerchantRoute: React.FC<MerchantRouteProps> = ({ children }) => {
  const { user, isLoading, isMerchant } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[70vh]">Загрузка...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isMerchant()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default MerchantRoute;
