import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useToast } from '../hooks/use-toast';

// Add Razorpay type definition
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveInfo: boolean;
}

interface ShippingAddress {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const Checkout = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveInfo: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load saved addresses
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/shipping-addresses`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSavedAddresses(data.shippingAddresses);
          // Set default address if available
          const defaultAddress = data.shippingAddresses.find((addr: ShippingAddress) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      let shippingAddress;
      
      if (selectedAddressId) {
        // Use selected saved address
        shippingAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
      } else {
        // Validate new address form
        if (!formData.firstName || !formData.email || !formData.phone || !formData.address) {
          throw new Error('Please fill in all required fields');
        }
        
        shippingAddress = {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: formData.country
        };

        // Save new address if requested
        if (formData.saveInfo) {
          const saveAddressResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/shipping-address`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              street: formData.address,
              city: formData.city,
              state: formData.state,
              postalCode: formData.zipCode,
              country: formData.country || 'India',
              isDefault: savedAddresses.length === 0 // Make default if first address
            })
          });

          if (!saveAddressResponse.ok) {
            const errorData = await saveAddressResponse.json();
            throw new Error(errorData.message || 'Failed to save shipping address');
          }
        }
      }

      // Format items for order creation
      const orderItems = items.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      // Create order with shipping address
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          totalAmount: totalPrice
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalPrice * 100, // Amount in paise
        currency: 'INR',
        name: 'Ethereal Threads',
        description: `Order for ${items.length} items`,
        order_id: orderData.razorpayOrder.id,
        handler: async function(response: any) {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Handle successful payment
            toast({
              title: 'Payment Successful',
              description: 'Your order has been placed successfully!',
            });
            clearCart();
            navigate('/order-confirmation');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: 'Payment Verification Failed',
              description: 'There was an error verifying your payment. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#a855f7' // glam-purple color
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="pt-32 pb-16">
      <div className="container-custom max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
                    <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect}>
                      {savedAddresses.map((address) => (
                        <div key={address._id} className="flex items-start space-x-3 mb-4">
                          <RadioGroupItem value={address._id} id={address._id} />
                          <Label htmlFor={address._id} className="flex-1">
                            <div className="font-medium">
                              {address.street}, {address.city}
                            </div>
                            <div className="text-sm text-gray-500">
                              {address.state}, {address.postalCode}, {address.country}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowNewAddressForm(true)}
                    >
                      Add New Address
                    </Button>
                  </div>
                )}

                {(showNewAddressForm || savedAddresses.length === 0) && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={formData.city}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          value={formData.state}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode" 
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        name="country" 
                        value={formData.country}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="saveInfo" 
                        name="saveInfo" 
                        checked={formData.saveInfo}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, saveInfo: checked as boolean }))
                        }
                      />
                      <Label htmlFor="saveInfo">Save this information for next time</Label>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-glam-purple hover:bg-glam-purple-dark"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">RS {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>RS {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>RS {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 