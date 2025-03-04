
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, Package, BarChart3, Settings } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface MobileNavbarProps {
  isMerchant: boolean;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ isMerchant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  
  const clientNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBag, label: 'Shop', path: '/catalogue' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: itemCount > 0 ? itemCount : undefined },
  ];
  
  const merchantNavItems = [
    { icon: Home, label: 'Dashboard', path: '/merchant' },
    { icon: Package, label: 'Products', path: '/merchant/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/merchant/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/merchant/analytics' },
  ];
  
  const navItems = isMerchant ? merchantNavItems : clientNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
