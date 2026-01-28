import { create } from 'zustand'
import { authAPI } from '../services/api'

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to handle initial load
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

      // API Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { access_token, user: userData } = response.data;

          // Set token and basic user data immediately
          localStorage.setItem('access_token', access_token);
          set({ 
            token: access_token, 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false 
          });

          // Optional: You can still fetch more detailed user data if needed,
          // but the login is already considered successful.
          // For now, we trust the user data from the login response.
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.detail || 'Login failed';
          set({ error: message, isLoading: false, isAuthenticated: false, user: null, token: null });
          localStorage.removeItem('access_token'); // Clear invalid token
          return { success: false, error: message };
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          console.log('Attempting registration with data:', { ...data, password: '***' })
          const response = await authAPI.register(data)
          console.log('Registration successful:', response.data)
          set({ isLoading: false })
          return { success: true, data: response.data }
        } catch (error) {
          console.error('Registration error:', error)
          let message = 'Registration failed'
          
          if (error.response) {
            // Server responded with error
            message = error.response.data?.detail || error.response.data?.message || message
            console.error('Server error:', {
              status: error.response.status,
              data: error.response.data,
              headers: error.response.headers
            })
          } else if (error.request) {
            // Request made but no response
            message = 'Cannot connect to server. Please check if backend is running.'
            console.error('No response from server. Request:', {
              url: error.config?.url,
              baseURL: error.config?.baseURL,
              method: error.config?.method,
              timeout: error.config?.timeout
            })
          } else {
            // Error in request setup
            message = error.message || message
            console.error('Request setup error:', error.message)
          }
          
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      // Action to rehydrate auth state on app load
      rehydrate: async () => {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.log('No token found, setting unauthenticated state');
          set({ isLoading: false, isAuthenticated: false, user: null, token: null });
          return;
        }

        console.log('Token found, attempting to restore session...');
        set({ isLoading: true });
        
        try {
          // Set token first to authorize the getMe request
          set({ token }); 
          const userResponse = await authAPI.getMe();
          set({ 
            user: userResponse.data, 
            token,
            isAuthenticated: true, 
            isLoading: false 
          });
          console.log('Session restored successfully:', userResponse.data);
        } catch (error) {
          console.error("Session restore failed:", error.response?.status, error.response?.data);
          // If token is invalid, clear auth state
          localStorage.removeItem('access_token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      fetchUser: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isLoading: false });
          return;
        }
        
        set({ isLoading: true });
        try {
          const response = await authAPI.getMe()
          set({ user: response.data, isAuthenticated: true, isLoading: false })
        } catch (error) {
          localStorage.removeItem('access_token')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }
))

export default useAuthStore
