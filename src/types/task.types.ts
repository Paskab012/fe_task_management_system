export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  startDate?: string
  completedAt?: string
  estimatedHours?: number
  position?: number
  tags: string[]
  metadata: Record<string, unknown>
  boardId: string
  assignedUserId?: string
  createdById: string
  parentTaskId?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  
  // Relations
  board?: {
    id: string
    name: string
  }
  assignedUser?: {
    [x: string]: string | undefined
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdBy?: {
    [x: string]: string | undefined
    id: string
    firstName: string
    lastName: string
    email: string
  }
  parentTask?: {
    id: string
    title: string
  }
  subTasks?: Task[]
  comments?: unknown[]
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  position?: number
  tags?: string[]
  metadata?: Record<string, unknown>
  boardId: string
  assignedUserId?: string
  parentTaskId?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  position?: number
  tags?: string[]
  metadata?: Record<string, unknown>
  assignedUserId?: string
  completedAt?: string
}

export interface TaskFilters {
  page?: number
  limit?: number
  search?: string
  status?: TaskStatus
  priority?: TaskPriority
  boardId?: string
  assignedUserId?: string
}

export interface TasksResponse {
  message: string
  response: Task[]
  pagination?: {
    pages: number
    page: number
    count: number
    perPage: number
  }
}

export interface TaskResponse {
  message: string
  response: Task
}