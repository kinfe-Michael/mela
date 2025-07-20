import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  setCartItems: (items: CartItem[]) => void;
  setLoading: (status: boolean) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      loading: true,

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
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemToAdd.id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          } else {
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
    }),
    {
      name: 'cart-data', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default useCartStore;