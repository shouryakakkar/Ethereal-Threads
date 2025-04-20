import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-16">
        <div className="container-custom">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some beautiful jewelry to your cart!</p>
              <Button onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <Card key={item._id} className="mb-4">
                <CardContent className="flex items-center p-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                    onError={(e) => {
                      console.error('Image load error for:', item.name);
                      console.error('Image path:', item.image);
                      console.error('Full image URL:', `${import.meta.env.VITE_API_URL}${item.image}`);
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">RS {item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-4">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold mb-2">
                      RS {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span>Items ({totalItems})</span>
                  <span>RS {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>RS {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-glam-purple hover:bg-glam-purple-dark" 
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
