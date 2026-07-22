import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'ayzar_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.variantId === variant.id
      );

      if (existingItem) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          title: product.title,
          handle: product.handle,
          variantTitle: variant.title,
          price: variant.price,
          currencyCode: variant.currencyCode || product.currencyCode,
          image: product.images?.[0] || '',
          quantity: quantity,
        },
      ];
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const getCurrencyCode = () => {
    return cartItems[0]?.currencyCode || 'PKR';
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cartItems,
    isCartOpen,
    isCheckingOut,
    setIsCheckingOut,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getCurrencyCode,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
