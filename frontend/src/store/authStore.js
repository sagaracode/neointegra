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
          await authAPI.register(data)
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.detail || 'Registration failed'
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
