export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  timestamp: number;
  lastModified: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  lastAction?: CartAction;
}

export interface CartAction {
  type: 'add' | 'remove' | 'update' | 'clear';
  productId?: number;
  quantity?: number;
  previousState?: CartItem[];
  timestamp: number;
}

export interface CartContextType {
  // State
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  
  // Actions
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Undo functionality
  canUndo: boolean;
  undo: () => Promise<void>;
  
  // Quick access
  getItem: (productId: number) => CartItem | undefined;
  getItemQuantity: (productId: number) => number;
}