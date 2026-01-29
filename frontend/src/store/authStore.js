import { create } from 'zustand'
import { authAPI } from '../services/api'

const useAuthStore = create((set, get) => ({
  // State - Initialize from localStorage immediately
  user: null,
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setToken: (token) => {
    localStorage.setItem('access_token', token)
    set({ token, isAuthenticated: true })
  },
  
  clearAuth: () => {
    localStorage.removeItem('access_token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('access_token', access_token);
      set({ 
        token: access_token, 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login gagal';
      set({ error: message, isLoading: false, isAuthenticated: false, user: null, token: null });
      localStorage.removeItem('access_token');
      return { success: false, error: message };
    }
  },

  // Register
  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.register(data)
      set({ isLoading: false })
      return { success: true, data: response.data }
    } catch (error) {
      let message = 'Registrasi gagal'
      
      if (error.response) {
        message = error.response.data?.detail || error.response.data?.message || message
      } else if (error.request) {
        message = 'Tidak dapat terhubung ke server.'
      } else {
        message = error.message || message
      }
      
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  // Initialize - called once on app load
  initialize: () => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      set({ token, isAuthenticated: true });
      // Fetch user data in background - but don't break auth if it fails
      authAPI.getMe()
        .then(response => {
          set({ user: response.data });
        })
        .catch(error => {
          console.error('Failed to load user:', error);
          // Only clear auth if server explicitly says token is invalid (401)
          if (error.response?.status === 401) {
            console.warn('[Auth] Token invalid, clearing session');
            localStorage.removeItem('access_token');
            set({ user: null, token: null, isAuthenticated: false });
          }
          // For other errors (network, 500, etc), keep the session
        });
    }
  },

  // Fetch current user (non-blocking)
  fetchUser: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    authAPI.getMe()
      .then(response => {
        set({ user: response.data, isAuthenticated: true });
      })
      .catch(error => {
        console.error('Failed to fetch user:', error);
      });
  },
}))

export { useAuthStore }
export default useAuthStore
