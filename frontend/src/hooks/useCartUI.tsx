import { createContext, useContext, useState, ReactNode } from 'react';

interface CartUIContextType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  autoPeek: () => void;
}

const CartUIContext = createContext<CartUIContextType | null>(null);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const autoPeek = () => {
    setIsDrawerOpen(true);
    // Auto-close after 2 seconds
    setTimeout(() => {
      setIsDrawerOpen(false);
    }, 2000);
  };

  return (
    <CartUIContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        autoPeek,
      }}
    >
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error('useCartUI must be used within a CartUIProvider');
  }
  return context;
}