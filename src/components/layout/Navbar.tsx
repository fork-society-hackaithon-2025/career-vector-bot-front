import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  LogOut, 
  User
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  isMerchant: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isMerchant }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold text-xl flex items-center gap-2">
          TG Order Manager
        </Link>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {!isMerchant && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                title="Выйти"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="font-medium"
            >
              <User className="mr-2 h-4 w-4" />
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
