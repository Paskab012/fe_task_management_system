/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userService } from '@/services/user.service'
import { 
  CreateUserData, 
  UpdateUserData, 
  UserFilters,
//   ChangePasswordData,
//   ResetPasswordData
} from '@/types/user.types'

// Get all users with filters
export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getAllUsers(filters),
    staleTime: 30000,
  })
}

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  })
}

// Get user statistics
export const useUserStats = (userId: string, isActive: boolean) => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () => userService.toggleUserStatus(userId, isActive),
    staleTime: 60000,
  })
}

// Get user activity
export const useUserActivity = (userId: string) => {
  return useQuery({
    queryKey: ['user-activity', userId],
    queryFn: () => userService.getUserActivity(userId),
    enabled: !!userId,
  })
}

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: CreateUserData) => userService.createUser(userData),
    onSuccess: (data) => {
      console.log('userData ceate user ======:>> ', data);
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
    onError: (error: any) => {
      console.log('error create user===== :>> ', error);
      const message = error.response?.data?.message || 'Failed to create user'
      toast.error(message)
    },
  })
}

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => 
      userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      toast.success('User updated successfully!')
      queryClient.setQueryData(['user', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update user'
      toast.error(message)
    },
  })
}

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
    },
  })
}

// Toggle user status mutation
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      userService.toggleUserStatus(id, isActive),
    onSuccess: (data, variables) => {
      toast.success(variables.isActive ? 'User activated!' : 'User deactivated!')
      queryClient.setQueryData(['user', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update user status'
      toast.error(message)
    },
  })
}