import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sweet, CartItem, Address } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (sweet: Sweet) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  checkout: (address: Address) => Promise<void>;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sugarrush_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('sugarrush_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (sweet: Sweet) => {
    // Check if item is out of stock
    if (sweet.quantity === 0) {
      alert(`Sorry, ${sweet.name} is currently sold out.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === sweet.id);
      if (existing) {
        if (existing.cartQuantity >= sweet.quantity) {
          alert(`Sorry, you cannot add more ${sweet.name}. Only ${sweet.quantity} available.`);
          return prev;
        }
        return prev.map(item => 
          item.id === sweet.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 } 
            : item
        );
      }
      return [...prev, { ...sweet, cartQuantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (sweetId: string) => {
    setCart(prev => prev.filter(item => item.id !== sweetId));
  };

  const updateQuantity = (sweetId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === sweetId) {
        const newQuantity = item.cartQuantity + delta;
        if (newQuantity < 1) return item;
        if (newQuantity > item.quantity) {
           alert(`Cannot exceed available stock of ${item.quantity}`);
           return item;
        }
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);
  
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const checkout = async (address: Address) => {
    if (!user) {
      alert("Please log in to complete your purchase.");
      return;
    }
    if (cart.length === 0) return;

    try {
    // Use atomic createOrder API
    await api.createOrder(user.id, cart, address);
    
    clearCart();
    setIsCartOpen(false);
    
    // Slight delay to allow UI to close smoothly before alert
    setTimeout(() => {
      alert("Order placed successfully! 🍬 Check your profile for order status.");
      // Reload to refresh stock quantities
      window.location.reload(); 
    }, 300);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || "Failed to place order. Please try again.");
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.cartQuantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      isCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      toggleCart,
      checkout,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};