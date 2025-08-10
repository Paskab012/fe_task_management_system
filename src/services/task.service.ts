import api from './api.service'
import { 
  CreateTaskData, 
  UpdateTaskData, 
  TaskFilters, 
  TasksResponse, 
  TaskResponse,
  TaskStatus 
} from '@/types/task.types'

export const taskService = {
  // Create a new task (Admin/Super Admin only)
  async createTask(taskData: CreateTaskData): Promise<TaskResponse> {
    try {
      const response = await api.post<TaskResponse>('/tasks', taskData)
      return response.data
    } catch (error) {
      console.error('Create task failed:', error)
      throw error
    }
  },

  // Get all tasks with pagination and filters
  async getAllTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.boardId) params.append('boardId', filters.boardId)
      if (filters.assignedUserId) params.append('assignedUserId', filters.assignedUserId)

      const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Get tasks failed:', error)
      throw error
    }
  },

  // Get user's assigned tasks
  async getMyTasks(filters: { page?: number; limit?: number; status?: TaskStatus } = {}): Promise<TasksResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.status) params.append('status', filters.status)

      const response = await api.get<TasksResponse>(`/tasks/my-tasks?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Get my tasks failed:', error)
      throw error
    }
  },

  // Get task by ID
  async getTaskById(id: string): Promise<TaskResponse> {
    try {
      const response = await api.get<TaskResponse>(`/tasks/${id}`)
      return response.data
    } catch (error) {
      console.error('Get task by ID failed:', error)
      throw error
    }
  },

  // Update task
  async updateTask(id: string, updateData: UpdateTaskData): Promise<TaskResponse> {
    try {
      console.log('🔄 Updating task:', id, updateData)
      const response = await api.patch<TaskResponse>(`/tasks/${id}`, updateData)
      console.log('✅ Task updated successfully')
      return response.data
    } catch (error) {
      console.error('Update task failed:', error)
      throw error
    }
  },

  // Delete task (Admin/Super Admin only)
  async deleteTask(id: string): Promise<{ message: string }> {
    try {
      console.log('🗑️ Deleting task:', id)
      const response = await api.delete<{ message: string }>(`/tasks/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete task failed:', error)
      throw error
    }
  },

  // Assign task to user (Admin/Super Admin only)
  async assignTask(taskId: string, userId: string): Promise<TaskResponse> {
    try {
      console.log('👤 Assigning task:', taskId, 'to user:', userId)
      const response = await api.patch<TaskResponse>(`/tasks/${taskId}/assign/${userId}`)
      console.log('✅ Task assigned successfully')
      return response.data
    } catch (error) {
      console.error('Assign task failed:', error)
      throw error
    }
  },

  // Update task status only
  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskResponse> {
    try {
      console.log('📊 Updating task status:', id, status)
      const response = await api.patch<TaskResponse>(`/tasks/${id}/status`, { status })
      console.log('✅ Task status updated successfully')
      return response.data
    } catch (error) {
      console.error('Update task status failed:', error)
      throw error
    }
  },

  // Get tasks by board
  async getTasksByBoard(boardId: string, filters: { page?: number; limit?: number; status?: TaskStatus } = {}): Promise<TasksResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.status) params.append('status', filters.status)

      const response = await api.get<TasksResponse>(`/tasks/board/${boardId}?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Get tasks by board failed:', error)
      throw error
    }
  },
}