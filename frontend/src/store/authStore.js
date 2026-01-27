import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
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

      // API Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login({ email, password })
          const { access_token } = response.data
          
          localStorage.setItem('access_token', access_token)
          set({ token: access_token, isAuthenticated: true })
          
          // Fetch user data
          const userResponse = await authAPI.getMe()
          set({ user: userResponse.data, isLoading: false })
          
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.detail || 'Login failed'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
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
        localStorage.removeItem('access_token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      fetchUser: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) return
        
        set({ isLoading: true })
        try {
          const response = await authAPI.getMe()
          set({ user: response.data, isAuthenticated: true, isLoading: false })
        } catch (error) {
          localStorage.removeItem('access_token')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)

export default useAuthStore
