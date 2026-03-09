import React, { createContext, useContext, useMemo, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  restaurantName: string;
  image?: string;
  quantity: number;
}

type NewCartItem = Omit<CartItem, 'quantity'>;

interface CartContextValue {
  items: CartItem[];
  addItem: (item: NewCartItem) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: NewCartItem): void => {
    setItems((previous) => {
      const existingItem = previous.find((value) => value.id === item.id);

      if (existingItem) {
        return previous.map((value) =>
          value.id === item.id
            ? {
                ...value,
                quantity: value.quantity + 1,
              }
            : value,
        );
      }

      return [
        ...previous,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (id: string): void => {
    setItems((previous) => previous.filter((value) => value.id !== id));
  };

  const incrementItem = (id: string): void => {
    setItems((previous) =>
      previous.map((value) =>
        value.id === id
          ? {
              ...value,
              quantity: value.quantity + 1,
            }
          : value,
      ),
    );
  };

  const decrementItem = (id: string): void => {
    setItems((previous) =>
      previous
        .map((value) =>
          value.id === id
            ? {
                ...value,
                quantity: value.quantity - 1,
              }
            : value,
        )
        .filter((value) => value.quantity > 0),
    );
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, value) => sum + value.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, value) => sum + value.quantity * value.price, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
