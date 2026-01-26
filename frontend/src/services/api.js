import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getFeatured: () => api.get('/services/featured'),
  getTypes: () => api.get('/services/types'),
  getBySlug: (slug) => api.get(`/services/${slug}`),
  getById: (id) => api.get(`/services/id/${id}`),
}

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getByNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
  cancel: (orderNumber) => api.delete(`/orders/${orderNumber}`),
}

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/payments/create', data),
  getById: (id) => api.get(`/payments/${id}`),
  getByOrder: (orderId) => api.get(`/payments/order/${orderId}`),
  checkStatus: (paymentId) => api.post(`/payments/check-status/${paymentId}`),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  deleteProfile: () => api.delete('/users/profile'),
}

export default api
