export enum BoardVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private', 
  ORGANIZATION = 'organization',
}

export interface Board {
  id: string
  name: string
  description?: string
  visibility: BoardVisibility
  color?: string
  icon?: string
  position?: number
  isArchived: boolean
  metadata: Record<string, unknown>
  createdById: string
  organizationId?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  
  // Relations
  createdBy?: {
    [x: string]: string | undefined
    id: string
    firstName: string
    lastName: string
    email: string
  }
  organization?: {
    id: string
    name: string
  }
  tasks?: unknown[]
  members?: BoardMember[]
  _count?: {
    tasks: number
    members: number
  }
}

export interface BoardMember {
  id: string
  boardId: string
  userId: string
  role: BoardMemberRole
  joinedAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
}

export enum BoardMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export interface CreateBoardData {
  name: string
  description?: string
  visibility?: BoardVisibility
  color?: string
  icon?: string
  position?: number
  metadata?: Record<string, unknown>
  organizationId?: string
}

export interface UpdateBoardData {
  name?: string
  description?: string
  visibility?: BoardVisibility
  color?: string
  icon?: string
  position?: number
  metadata?: Record<string, unknown>
  isArchived?: boolean
}

export interface BoardFilters {
  page?: number
  limit?: number
  search?: string
  visibility?: BoardVisibility
  organizationId?: string
  isArchived?: boolean
}

export interface BoardsResponse {
  message: string
  response: Board[]
  pagination?: {
    pages: number
    page: number
    count: number
    perPage: number
  }
}

export interface BoardResponse {
  message: string
  response: Board
}

export interface BoardStats {
  totalBoards: number
  publicBoards: number
  privateBoards: number
  organizationBoards: number
  myBoards: number
}