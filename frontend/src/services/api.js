import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Log API URL for debugging
console.log('API URL:', API_URL)

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
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
// CRITICAL: Do NOT auto-redirect on 401 - let components handle it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('[API Error]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Only clear token if it's truly an auth endpoint failure
    // Do NOT redirect here - let the component/store handle navigation
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      
      // Only clear token for non-auth endpoints (meaning token is invalid)
      // For auth endpoints (login/register), don't clear - just let error propagate
      if (!isAuthEndpoint) {
        console.warn('[API] Token may be invalid, clearing auth state');
        localStorage.removeItem('access_token');
        // Don't redirect here! Let PrivateRoute handle it on next render
      }
    }
    
    return Promise.reject(error);
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
  getAll: (params) => api.get('/services/', { params }),
  getFeatured: () => api.get('/services/featured'),
  getTypes: () => api.get('/services/types'),
  getBySlug: (slug) => api.get(`/services/${slug}`),
  getById: (id) => api.get(`/services/id/${id}`),
}

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders/', data),
  getAll: (params) => api.get('/orders/', { params }),
  getByNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
  cancel: (orderNumber) => api.delete(`/orders/${orderNumber}`),
}

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/payments/', data),
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
