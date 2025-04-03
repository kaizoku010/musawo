import { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: any, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: any, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      
      if (existingItem) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};