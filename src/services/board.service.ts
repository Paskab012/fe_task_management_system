import api from './api.service'
import { 
  CreateBoardData, 
  UpdateBoardData, 
  BoardFilters, 
  BoardsResponse, 
  BoardResponse,
  BoardMemberRole,
  BoardMember
} from '@/types/board.types'

export const boardService = {
  // Create a new board (Admin/Super Admin only)
  async createBoard(boardData: CreateBoardData): Promise<BoardResponse> {
    try {
      console.log('🚀 Creating board:', boardData)
      const response = await api.post<BoardResponse>('/boards', boardData)
      console.log('✅ Board created successfully')
      return response.data
    } catch (error) {
      console.error('Create board failed:', error)
      throw error
    }
  },

  // Get all boards with pagination and filters
  async getAllBoards(filters: BoardFilters = {}): Promise<BoardsResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.visibility) params.append('visibility', filters.visibility)
      if (filters.organizationId) params.append('organizationId', filters.organizationId)
      if (filters.isArchived !== undefined) params.append('isArchived', filters.isArchived.toString())

      const response = await api.get<BoardsResponse>(`/boards?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error(' Get boards failed:', error)
      throw error
    }
  },

  // Get user's boards
  async getMyBoards(filters: BoardFilters = {}): Promise<BoardsResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.visibility) params.append('visibility', filters.visibility)

      const response = await api.get<BoardsResponse>(`/boards/my-boards?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error(' Get my boards failed:', error)
      throw error
    }
  },

  // Get board by ID
  async getBoardById(id: string): Promise<BoardResponse> {
    try {
      const response = await api.get<BoardResponse>(`/boards/${id}`)
      return response.data
    } catch (error) {
      console.error(' Get board by ID failed:', error)
      throw error
    }
  },

  // Update board
  async updateBoard(id: string, updateData: UpdateBoardData): Promise<BoardResponse> {
    try {
      console.log('🔄 Updating board:', id, updateData)
      const response = await api.patch<BoardResponse>(`/boards/${id}`, updateData)
      console.log('✅ Board updated successfully')
      return response.data
    } catch (error) {
      console.error(' Update board failed:', error)
      throw error
    }
  },

  // Delete board (Admin/Super Admin only)
  async deleteBoard(id: string): Promise<{ message: string }> {
    try {
      console.log('🗑️ Deleting board:', id)
      const response = await api.delete<{ message: string }>(`/boards/${id}`)
      console.log('✅ Board deleted successfully')
      return response.data
    } catch (error) {
      console.error(' Delete board failed:', error)
      throw error
    }
  },

  // Archive/Unarchive board
  async toggleArchiveBoard(id: string, isArchived: boolean): Promise<BoardResponse> {
    try {
      console.log('📁 Toggling archive status:', id, isArchived)
      const response = await api.patch<BoardResponse>(`/boards/${id}/archive`, { isArchived })
      console.log('✅ Board archive status updated')
      return response.data
    } catch (error) {
      console.error(' Toggle archive failed:', error)
      throw error
    }
  },

  // Add member to board (Admin/Super Admin only)
  async addBoardMember(boardId: string, userId: string, role: BoardMemberRole): Promise<{ message: string }> {
    try {
      console.log('👤 Adding member to board:', boardId, userId, role)
      const response = await api.post<{ message: string }>(`/boards/${boardId}/members`, {
        userId,
        role
      })
      console.log('✅ Member added to board successfully')
      return response.data
    } catch (error) {
      console.error(' Add board member failed:', error)
      throw error
    }
  },

  // Remove member from board (Admin/Super Admin only)
  async removeBoardMember(boardId: string, userId: string): Promise<{ message: string }> {
    try {
      console.log('👤 Removing member from board:', boardId, userId)
      const response = await api.delete<{ message: string }>(`/boards/${boardId}/members/${userId}`)
      console.log('✅ Member removed from board successfully')
      return response.data
    } catch (error) {
      console.error(' Remove board member failed:', error)
      throw error
    }
  },

  // Update member role (Admin/Super Admin only)
  async updateMemberRole(boardId: string, userId: string, role: BoardMemberRole): Promise<{ message: string }> {
    try {
      console.log('👤 Updating member role:', boardId, userId, role)
      const response = await api.patch<{ message: string }>(`/boards/${boardId}/members/${userId}`, { role })
      console.log('✅ Member role updated successfully')
      return response.data
    } catch (error) {
      console.error(' Update member role failed:', error)
      throw error
    }
  },

  // Get board members
  async getBoardMembers(boardId: string): Promise<{ message: string; response: BoardMember[] }> {
    try {
      const response = await api.get<{ message: string; response: BoardMember[] }>(`/boards/${boardId}/members`)
      return response.data
    } catch (error) {
      console.error(' Get board members failed:', error)
      throw error
    }
  },
}