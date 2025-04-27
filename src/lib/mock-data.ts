
import { Product } from "@/types/product";
import { Order, OrderStatus } from "@/types/order";

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Fruit Basket",
    grossPrice: 23.50,
    price: 29.99,
    inventory: 20,
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Fresh Vegetables Pack",
    grossPrice: 18.75,
    price: 24.99,
    inventory: 15,
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "Artisanal Bread Loaf",
    grossPrice: 3.50,
    price: 5.99,
    inventory: 30,
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "4",
    name: "Gourmet Cheese Selection",
    grossPrice: 32.00,
    price: 39.99,
    inventory: 10,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "5",
    name: "Premium Coffee Beans",
    grossPrice: 12.50,
    price: 17.99,
    inventory: 25,
    image: "https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "6",
    name: "Farm Fresh Eggs (Dozen)",
    grossPrice: 3.25,
    price: 4.99,
    inventory: 40,
    image: "https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?q=80&w=300&auto=format&fit=crop"
  }
];

// Helper to generate a random date in the future (1-7 days)
const randomFutureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 7) + 1);
  return date;
};

// Helper to create an order with random products
const createMockOrder = (
  id: string, 
  clientId: string, 
  clientName: string, 
  status: OrderStatus = "PENDING",
  daysAgo = 0
): Order => {
  // Take 1-3 random products
  const selectedProducts = [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);
  
  const items = selectedProducts.map(product => ({
    product,
    quantity: Math.floor(Math.random() * 3) + 1,
    price: product.clientPrice
  }));
  
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  return {
    id,
    clientId,
    clientName,
    clientPhone: "+1" + Math.floor(Math.random() * 9000000000 + 1000000000),
    orderItems: items,
    totalPrice: totalAmount,
    deliveryDate: randomFutureDate(),
    status,
    createdAt: createdDate,
    updatedAt: createdDate
  };
};

// Generate some mock orders
export const orders: Order[] = [
  createMockOrder("order1", "client1", "John Doe", "confirmed", 2),
  createMockOrder("order2", "client2", "Jane Smith", "pending", 1),
  createMockOrder("order3", "client1", "John Doe", "delivered", 5),
  createMockOrder("order4", "client3", "Robert Johnson", "rejected", 3),
  createMockOrder("order5", "client4", "Sarah Williams", "confirmed", 0),
  createMockOrder("order6", "client2", "Jane Smith", "pending", 0),
];

// Function to get available delivery dates (next 7 days excluding today)
export const getAvailableDeliveryDates = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    // Reset hours to beginning of day
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  
  return dates;
};

// Function to calculate analytics data
export const generateAnalyticsData = () => {
  const today = new Date();
  
  // Daily revenue (last 7 days)
  const dailyRevenue = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - index);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    
    const ordersOnDate = orders.filter(order => 
      order.orderStatus === "CONFIRMED" || order.orderStatus === "DELIVERED" &&
      order.createdAt >= date && order.createdAt < nextDate
    );
    
    const total = ordersOnDate.reduce((sum, order) => sum + order.totalPrice, 0);
    
    return {
      date: date.toISOString().split('T')[0],
      amount: total
    };
  }).reverse();
  
  // Calculate weekly and monthly totals
  const weeklyTotal = dailyRevenue.reduce((sum, day) => sum + day.amount, 0);
  
  // Mock monthly data (just multiply weekly by 4 for simplicity)
  const monthlyTotal = weeklyTotal * 4;
  
  return {
    dailyRevenue,
    weeklyTotal,
    monthlyTotal
  };
};
