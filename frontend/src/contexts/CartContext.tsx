import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setItems(data.items.map((item: any) => ({
              ...item.product,
              quantity: item.quantity
            })));
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          toast({
            title: 'Error',
            description: 'Failed to load your cart. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      }
      setIsLoading(false);
    };

    loadCart();
  }, [isAuthenticated, token]);

  // Save cart to backend or localStorage
  useEffect(() => {
    if (isAuthenticated && token) {
      // Sync with backend
      const syncCart = async () => {
        try {
          // Update each item individually
          for (const item of items) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/cart/update`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                productId: item._id,
                quantity: item.quantity
              })
            });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      };

      syncCart();
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated, token]);

  const addToCart = async (product: Product) => {
    if (isAuthenticated && token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: 1
          })
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.items.map((item: any) => ({
            ...item.product,
            quantity: item.quantity
          })));
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: 'Error',
          description: 'Failed to add item to cart. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item._id === product._id);
        
        if (existingItem) {
          return currentItems.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...currentItems, { ...product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated && token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.items.map((item: any) => ({
            ...item.product,
            quantity: item.quantity
          })));
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove item from cart. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      setItems(currentItems => currentItems.filter(item => item._id !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    if (isAuthenticated && token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId,
            quantity
          })
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.items.map((item: any) => ({
            ...item.product,
            quantity: item.quantity
          })));
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        toast({
          title: 'Error',
          description: 'Failed to update cart. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      setItems(currentItems =>
        currentItems.map(item =>
          item._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setItems([]);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast({
          title: 'Error',
          description: 'Failed to clear cart. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      setItems([]);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
