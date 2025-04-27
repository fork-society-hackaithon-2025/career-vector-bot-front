import React, {useState} from 'react';
import {orders as initialOrders} from '@/lib/mock-data';
import {Order, OrderStatus} from '@/types/order';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Check, Download, Phone, X} from 'lucide-react';
import {format} from 'date-fns';
import {toast} from 'sonner';

const MerchantOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesSearch = order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  const handleConfirmOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'confirmed' as OrderStatus, updatedAt: new Date() } 
        : order
    ));
    
    toast.success('Order confirmed successfully');
  };
  
  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as OrderStatus, updatedAt: new Date() } 
        : order
    ));
    
    toast.success('Order rejected');
  };
  
  const handlePrintOrder = (order: Order) => {
    // This would typically generate a PDF or connect to a printer
    // For the demo, we'll just show a success message
    toast.success(`Order ${order.id} has been sent to print`);
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'DELIVERED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by customer name or order ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className={`h-2 ${getStatusColor(order.orderStatus)}`} />
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Order #{order.id.slice(-5)}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(order.createdAt, 'PPp')}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{order.clientName}</span>
                      <a 
                        href={`tel:${order.clientPhone}`}
                        className="inline-flex items-center text-sm text-primary hover:underline"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        {order.clientPhone}
                      </a>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">Delivery Date:</p>
                      <p>{format(order.deliveryDate, 'PPP')}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">Total Amount:</p>
                      <p className="text-xl font-bold">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    
                    <div className="w-full overflow-scroll flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintOrder(order)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedOrder && (
                            <>
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-medium">Customer Information</h3>
                                  <p>Name: {selectedOrder.clientName}</p>
                                  <p>Phone: {selectedOrder.clientPhone}</p>
                                </div>
                                
                                <div>
                                  <h3 className="font-medium">Order Items</h3>
                                  <div className="space-y-2 mt-2">
                                    {selectedOrder.items.map((item, index) => (
                                      <div key={index} className="flex justify-between">
                                        <div>
                                          <p className="font-medium">{item.productId}</p>
                                          <p className="text-sm text-muted-foreground">
                                            ${item.price.toFixed(2)} × {item.quantity}
                                          </p>
                                        </div>
                                        <p className="font-medium">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2 border-t">
                                  <p className="font-medium">Total Amount</p>
                                  <p className="font-bold text-lg">
                                    ${selectedOrder.totalPrice.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {order.orderStatus === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 hover:bg-red-50 text-red-500"
                            onClick={() => handleRejectOrder(order.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleConfirmOrder(order.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="py-8">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No orders found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MerchantOrders;
