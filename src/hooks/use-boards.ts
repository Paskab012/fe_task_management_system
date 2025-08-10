/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { boardService } from '@/services/board.service'
// import { userService } from '@/services/user.service'
import { 
  CreateBoardData, 
  UpdateBoardData, 
  BoardFilters,
  BoardMemberRole
} from '@/types/board.types'

// Get all boards with filters
export const useBoards = (filters: BoardFilters = {}) => {
  return useQuery({
    queryKey: ['boards', filters],
    queryFn: () => boardService.getAllBoards(filters),
    staleTime: 30000, // 30 seconds
  })
}

// Get user's boards
export const useMyBoards = (filters: BoardFilters = {}) => {
  return useQuery({
    queryKey: ['my-boards', filters],
    queryFn: () => boardService.getMyBoards(filters),
    staleTime: 30000,
  })
}

// Get board by ID
export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ['board', id],
    queryFn: () => boardService.getBoardById(id),
    enabled: !!id,
  })
}

// Get board members
export const useBoardMembers = (boardId: string) => {
  return useQuery({
    queryKey: ['board-members', boardId],
    queryFn: () => boardService.getBoardMembers(boardId),
    enabled: !!boardId,
  })
}

// Create board mutation
export const useCreateBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (boardData: CreateBoardData) => boardService.createBoard(boardData),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: () => {
      toast.success('Board created successfully!')
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      queryClient.invalidateQueries({ queryKey: ['my-boards'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create board'
      toast.error(message)
    },
  })
}

// Update board mutation
export const useUpdateBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardData }) => 
      boardService.updateBoard(id, data),
    onSuccess: (data, variables) => {
      toast.success('Board updated successfully!')
      // Update specific board in cache
      queryClient.setQueryData(['board', variables.id], data)
      // Invalidate board lists
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      queryClient.invalidateQueries({ queryKey: ['my-boards'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update board'
      toast.error(message)
    },
  })
}

// Delete board mutation
export const useDeleteBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => boardService.deleteBoard(id),
    onSuccess: () => {
      toast.success('Board deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      queryClient.invalidateQueries({ queryKey: ['my-boards'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete board'
      toast.error(message)
    },
  })
}

// Archive board mutation
export const useArchiveBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isArchived }: { id: string; isArchived: boolean }) => 
      boardService.toggleArchiveBoard(id, isArchived),
    onSuccess: (data, variables) => {
      toast.success(variables.isArchived ? 'Board archived!' : 'Board unarchived!')
      queryClient.setQueryData(['board', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      queryClient.invalidateQueries({ queryKey: ['my-boards'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update board'
      toast.error(message)
    },
  })
}

// Add board member mutation
export const useAddBoardMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boardId, userId, role }: { boardId: string; userId: string; role: BoardMemberRole }) => 
      boardService.addBoardMember(boardId, userId, role),
    onSuccess: (data, variables) => {
      toast.success('Member added to board!')
      queryClient.invalidateQueries({ queryKey: ['board-members', variables.boardId] })
      queryClient.invalidateQueries({ queryKey: ['board', variables.boardId] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add member'
      toast.error(message)
    },
  })
}

// Remove board member mutation
export const useRemoveBoardMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boardId, userId }: { boardId: string; userId: string }) => 
      boardService.removeBoardMember(boardId, userId),
    onSuccess: (data, variables) => {
      toast.success('Member removed from board!')
      queryClient.invalidateQueries({ queryKey: ['board-members', variables.boardId] })
      queryClient.invalidateQueries({ queryKey: ['board', variables.boardId] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove member'
      toast.error(message)
    },
  })
}

// Update member role mutation
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boardId, userId, role }: { boardId: string; userId: string; role: BoardMemberRole }) => 
      boardService.updateMemberRole(boardId, userId, role),
    onSuccess: (data, variables) => {
      toast.success('Member role updated!')
      queryClient.invalidateQueries({ queryKey: ['board-members', variables.boardId] })
      queryClient.invalidateQueries({ queryKey: ['board', variables.boardId] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update member role'
      toast.error(message)
    },
  })
}

// Get users for member assignment
// export const useUsers = () => {
//   return useQuery({
//     queryKey: ['users'],
//     queryFn: () => userService.getAllUsers(),
//     staleTime: 300000, 
//   })
// }