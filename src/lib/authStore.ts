import { create } from 'zustand';

interface User {
  userId: string;
  username: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean; 
  setAuthStatus: (status: boolean, user: User | null) => void;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: true, 
  setAuthStatus: (status, user) => set({ isLoggedIn: status, user, isLoading: false }),

  checkAuthStatus: async () => {
    set({ isLoading: true }); 
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      if (response.ok && data.isLoggedIn) {
        set({ isLoggedIn: true, user: data.user, isLoading: false });
      } else {
        set({ isLoggedIn: false, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      set({ isLoggedIn: false, user: null, isLoading: false });
    }
  },

  
  logout: async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        set({ isLoggedIn: false, user: null }); 
        console.log('Logged out successfully from client side.');
      } else {
        console.error('Logout failed on server:', await response.json());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },
}));
