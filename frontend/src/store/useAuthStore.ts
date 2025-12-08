import { create } from 'zustand';
import { api } from '@/lib/api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,

  login: async (email, password) => {
    try {
      // 1. Call the Backend
      const formData = new FormData();
      formData.append('username', email); // FastAPI OAuth2 expects 'username', not 'email'
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 2. Save Token
      const token = response.data.access_token;
      localStorage.setItem('token', token);

      // 3. Update State
      set({ token, isAuthenticated: true });
    } catch (error) {
      console.error('Login Failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
}));