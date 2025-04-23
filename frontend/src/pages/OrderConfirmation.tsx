import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderConfirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [orderNumber] = useState(() => `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="pt-32 pb-16">
      <div className="container-custom max-w-2xl mx-auto">
        <Card className={cn(
          "transition-all duration-700 transform",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been successfully placed and confirmed.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-xl font-semibold">{orderNumber}</p>
            </div>
            
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email with your order details. 
              You can track your order status using the order number above.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-glam-purple hover:bg-glam-purple-dark">
                <Link to="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/orders">View Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation; 