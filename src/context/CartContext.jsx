import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Завантаження кошика з localStorage при монтуванні
  useEffect(() => {
    if (currentUser) {
      const savedCart = localStorage.getItem(`cart_${currentUser.uid}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  // Збереження кошика в localStorage при зміні
  useEffect(() => {
    if (currentUser && cartItems.length >= 0) {
      localStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  // Додати товар до кошика
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Створити унікальний ключ на основі id, кольору та пам'яті
      const itemKey = `${product.id}-${product.selectedColor || 'default'}-${product.selectedStorage || product.storage}`;
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        item.selectedColor === product.selectedColor && 
        item.selectedStorage === product.selectedStorage
      );
      
      if (existingItem) {
        // Збільшити кількість якщо товар з таким самим кольором і пам'яттю вже є
        return prevItems.map(item =>
          item.id === product.id && 
          item.selectedColor === product.selectedColor && 
          item.selectedStorage === product.selectedStorage
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Додати новий товар
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Видалити товар з кошика
  const removeFromCart = (productId, color, storage) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === productId && 
        item.selectedColor === color && 
        item.selectedStorage === storage)
    ));
  };

  // Оновити кількість товару
  const updateQuantity = (productId, quantity, color, storage) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, storage);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && 
        item.selectedColor === color && 
        item.selectedStorage === storage
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Очистити кошик
  const clearCart = () => {
    setCartItems([]);
    if (currentUser) {
      localStorage.removeItem(`cart_${currentUser.uid}`);
    }
  };

  // Отримати загальну кількість товарів
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Отримати загальну суму
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseInt(item.price) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
