import api from './api.service'
import { 
  CreateUserData, 
  UpdateUserData, 
  UserFilters, 
  UsersResponse, 
  UserResponse,
} from '@/types/user.types'

export const userService = {
  async getAllUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.role) params.append('role', filters.role)
      if (filters.status) params.append('status', filters.status)
      if (filters.organizationId) params.append('organizationId', filters.organizationId)
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
      if (filters.department) params.append('department', filters.department)

      const response = await api.get<UsersResponse>(`/users?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error(' Get users failed:', error)
      throw error
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(' Get user by ID failed:', error)
      throw error
    }
  },

  // Create user (Admin/Super Admin only)
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      console.log('🚀 Creating user=====:', userData)
      const response = await api.post<UserResponse>('/users', userData)
      console.log('✅ User created successfully')
      return response.data
    } catch (error) {
      console.error(' Create user failed:', error)
      throw error
    }
  },

  // Update user (Admin/Super Admin only)
  async updateUser(id: string, updateData: UpdateUserData): Promise<UserResponse> {
    try {
      console.log('🔄 Updating user:', id, updateData)
      const response = await api.patch<UserResponse>(`/users/${id}`, updateData)
      console.log('✅ User updated successfully')
      return response.data
    } catch (error) {
      console.error(' Update user failed:', error)
      throw error
    }
  },

  // Delete user (Super Admin only)
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      console.log('🗑️ Deleting user:', id)
      const response = await api.delete<{ message: string }>(`/users/${id}`)
      console.log('✅ User deleted successfully')
      return response.data
    } catch (error) {
      console.error(' Delete user failed:', error)
      throw error
    }
  },

  // Toggle user activation status
  async toggleUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
    try {
      console.log('🔄 Toggling user status:', id, isActive)
      const response = await api.patch<UserResponse>(`/users/${id}/toggle-status`, { isActive })
      console.log('✅ User status updated successfully')
      return response.data
    } catch (error) {
      console.error(' Toggle user status failed:', error)
      throw error
    }
  },
}