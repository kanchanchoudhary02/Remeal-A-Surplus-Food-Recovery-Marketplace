// context/CartContext.jsx
// AuthContext jaisa hi pattern — global state jo poore app me cart data share kare

import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // [{ food, quantity }, ...]

  const addToCart = (food, quantity) => {
    setItems((prev) => {
      // Agar ye food pehle se cart me hai, uski quantity update karo
      const existing = prev.find((item) => item.food._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item.food._id === food._id ? { ...item, quantity } : item
        );
      }
      // Nahi to naya item add karo
      return [...prev, { food, quantity }];
    });
  };

  const removeFromCart = (foodId) => {
    setItems((prev) => prev.filter((item) => item.food._id !== foodId));
  };

  const updateQuantity = (foodId, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.food._id === foodId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  // Subtotal — sabhi items ka total price
  const subtotal = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);