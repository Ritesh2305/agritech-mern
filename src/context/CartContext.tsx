import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  resourceId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (resourceId: string) => void;
  updateQuantity: (resourceId: string, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('agritech_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        resourceId: 'res_1',
        name: 'Certified Hybrid Cotton Seeds (BG-II)',
        price: 850,
        quantity: 2,
        unit: '450g packet',
        imageUrl: '/src/assets/images/organic_seeds_resources_1793110538678.jpg',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('agritech_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.resourceId === item.resourceId);
      if (existing) {
        return prev.map(i =>
          i.resourceId === item.resourceId
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (resourceId: string) => {
    setItems(prev => prev.filter(i => i.resourceId !== resourceId));
  };

  const updateQuantity = (resourceId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => {
          if (i.resourceId === resourceId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
