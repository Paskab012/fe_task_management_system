import axios, { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const { response } = error
    const { clearAuth } = useAuthStore.getState()

    if (response?.status === 401) {
      clearAuth()
      toast.error('Session expired. Please login again.')
      window.location.href = '/auth/login'
      return Promise.reject(error)
    }

    if (response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.')
      return Promise.reject(error)
    }

    if (response?.status >= 500) {
      toast.error('Server error. Please try again later.')
      return Promise.reject(error)
    }

    const message = response?.data?.message || 'An unexpected error occurred'
    toast.error(message)

    return Promise.reject(error)
  }
)

export default api