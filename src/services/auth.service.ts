import api from '@/services/api.service'
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', credentials)
    console.log('response register==== :>> ', response);
    console.log('response.data==== :>> ', response.data);
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', {
      email,
    })
    return response.data
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      password,
    })
    return response.data
  },
}