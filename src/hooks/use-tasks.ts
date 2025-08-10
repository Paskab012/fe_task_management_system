/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { taskService } from '@/services/task.service'
import { boardService } from '@/services/board.service'
import { userService } from '@/services/user.service'
import { 
  CreateTaskData, 
  UpdateTaskData, 
  TaskFilters, 
  TaskStatus 
} from '@/types/task.types'

// Get all tasks with filters
export const useTasks = (filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getAllTasks(filters),
    staleTime: 30000,
  })
}

// Get user's tasks
export const useMyTasks = (filters: { page?: number; limit?: number; status?: TaskStatus } = {}) => {
  return useQuery({
    queryKey: ['my-tasks', filters],
    queryFn: () => taskService.getMyTasks(filters),
    staleTime: 30000,
  })
}

// Get task by ID
export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  })
}

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskData: CreateTaskData) => taskService.createTask(taskData),
    onSuccess: () => {
      toast.success('Task created successfully!')
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create task'
      toast.error(message)
    },
  })
}

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) => 
      taskService.updateTask(id, data),
    onSuccess: (data, variables) => {
      toast.success('Task updated successfully!')
      // Update specific task in cache
      queryClient.setQueryData(['task', variables.id], data)
      // Invalidate task lists
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update task'
      toast.error(message)
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      console.log('🗑️ Delete task mutation called for ID:', id)
      return taskService.deleteTask(id)
    },
    onSuccess: (data, variables) => {
      console.log('🗑️ Task deleted:', data)
      toast.success('Task deleted successfully!')
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task'] })
      queryClient.removeQueries({ queryKey: ['task', variables] })
      queryClient.refetchQueries({ queryKey: ['tasks'] })
    },
    onError: (error: any) => {      
      const message = error.response?.data?.message || 'Failed to delete task'
      toast.error(message)
    },
  })
}

// Assign task mutation
export const useAssignTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) => 
      taskService.assignTask(taskId, userId),
    onSuccess: () => {
      toast.success('Task assigned successfully!')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to assign task'
      toast.error(message)
    },
  })
}

// Update task status mutation
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => 
      taskService.updateTaskStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success('Task status updated!')
      queryClient.setQueryData(['task', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update task status'
      toast.error(message)
    },
  })
}

// Get boards for task creation
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => boardService.getAllBoards(),
    staleTime: 300000, // 5 minutes
  })
}

// Get users for task assignment
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
    staleTime: 300000, // 5 minutes
  })
}