// store/useCartStore.ts
import { create } from 'zustand';

// Define the CartItem interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// Define the Zustand store interface
interface CartState {
  cartItems: CartItem[];
  loading: boolean; // Indicates if cart data is being loaded (e.g., from local storage or API)
  setCartItems: (items: CartItem[]) => void;
  setLoading: (status: boolean) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void; // Add item to cart
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

// Create the Zustand store
const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  loading: true, // Default to true, assuming data will be loaded

  setCartItems: (items) => set({ cartItems: items }),
  setLoading: (status) => set({ loading: status }),

  increaseQuantity: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  decreaseQuantity: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      ),
    })),

  addItem: (itemToAdd, quantity = 1) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.id === itemToAdd.id);
      if (existingItem) {
        // If item exists, increase its quantity
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === itemToAdd.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      } else {
        // If item does not exist, add it to the cart
        return {
          cartItems: [...state.cartItems, { ...itemToAdd, quantity }],
        };
      }
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cartItems: [] }),

  calculateTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

export default useCartStore;
