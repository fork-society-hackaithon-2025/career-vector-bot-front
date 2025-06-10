import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Home, ShoppingBag, ShoppingCart, Package, BarChart3, Tags, Users, MoreHorizontal} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom hook to get window width
function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

interface MobileNavbarProps {
  isMerchant: boolean;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ isMerchant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const width = useWindowWidth();
  
  const clientNavItems: NavItem[] = [
    { icon: ShoppingBag, label: 'Товары', path: '/catalogue' },
    { icon: Package, label: 'Заказы', path: '/my-orders' },
    { icon: ShoppingCart, label: 'Корзина', path: '/cart', badge: itemCount > 0 ? itemCount : undefined },
  ];
  
  const merchantNavItems: NavItem[] = [
    { icon: Home, label: 'Панель', path: '/merchant' },
    { icon: ShoppingBag, label: 'Заказы', path: '/merchant/orders' },
    { icon: Package, label: 'Товары', path: '/merchant/products' },
    { icon: Tags, label: 'Категории', path: '/merchant/categories' },
    { icon: Users, label: 'Клиенты', path: '/merchant/clients' },
    { icon: BarChart3, label: 'Аналитика', path: '/merchant/analytics' },
  ];

  const navItems = isMerchant ? merchantNavItems : clientNavItems;
  const maxVisibleItems = 4;
  const shouldShowAll = width >= 640; // sm breakpoint
  
  const visibleItems = shouldShowAll ? navItems : navItems.slice(0, maxVisibleItems);
  const overflowItems = shouldShowAll ? [] : navItems.slice(maxVisibleItems);

  const NavButton = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <button
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
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16">
        {visibleItems.map((item) => (
          <NavButton key={item.path} item={item} />
        ))}
        
        {overflowItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary">
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-xs">Ещё</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-48">
              {overflowItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <DropdownMenuItem
                    key={item.path}
                    className={cn(
                      "flex items-center gap-2",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
