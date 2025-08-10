export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'super_admin' | 'admin' | 'user' | 'guest'
  avatar?: string
  organizationId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  status: string
  message: string
  response: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}