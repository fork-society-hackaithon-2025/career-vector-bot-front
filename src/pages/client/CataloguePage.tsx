import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {products} from '@/lib/mock-data';
import {useCart} from '@/contexts/CartContext';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Minus, Plus, ShoppingCart} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {motion} from 'framer-motion';

const CataloguePage = () => {
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    products.reduce((acc, product) => ({
      ...acc,
      [product.id]: items.find(item => item.product.id === product.id)?.quantity || 0
    }), {})
  );

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem(product, 1);
      setQuantities(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    if (quantities[productId] > 0) {
      setQuantities(prev => ({
        ...prev,
        [productId]: prev[productId] - 1
      }));
    }
  };

  const handleIncreaseQuantity = (productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleAddToCartWithQuantity = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && quantities[productId] > 0) {
      addItem(product, quantities[productId]);
      setQuantities(prev => ({
        ...prev,
        [productId]: 0
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          View Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full flex flex-col overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image || '/placeholder.svg'})` }}
              />
              <CardContent className="flex-grow p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <Badge variant="outline" className="ml-2">
                    ${product.price.toFixed(2)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  In stock: {product.inventory}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
                {quantities[product.id] > 0 ? (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecreaseQuantity(product.id)}
                        disabled={quantities[product.id] <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 w-8 text-center">
                        {quantities[product.id]}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncreaseQuantity(product.id)}
                        disabled={quantities[product.id] >= product.inventory}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCartWithQuantity(product.id)}
                    >
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CataloguePage;
