/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth-store'
import { LoginCredentials, RegisterCredentials } from '@/types/auth.types'

export const useLogin = () => {
  const navigate = useNavigate()
  const { setAuth, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data.response
      setAuth(user, accessToken, refreshToken)
      toast.success('Welcome back!')
      
      if (['super_admin', 'admin'].includes(user.role)) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      setLoading(false)
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const { setAuth, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data as any
      setAuth(user, accessToken, refreshToken)
      toast.success('Account created successfully!')
      navigate('/auth/login')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      setLoading(false)
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth()
      toast.success('Logged out successfully')
      navigate('/auth/login')
    },
    onError: () => {
      clearAuth()
      navigate('/auth/login')
    },
  })
}