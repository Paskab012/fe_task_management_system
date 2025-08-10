export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  phone?: string
  jobTitle?: string
  department?: string
  location?: string
  organizationId?: string
  isActive: boolean
  emailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  
  // Relations
  organization?: {
    id: string
    name: string
  }
  createdBy?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  _count?: {
    createdTasks: number
    assignedTasks: number
    createdBoards: number
  }
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
  isActive?: UserStatus | boolean
  phone?: string
  jobTitle?: string
  department?: string
  location?: string
  organizationId?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
  role?: UserRole
  status?: UserStatus
  phoneNumber?: string
  jobTitle?: string
  department?: string
  location?: string
  isActive?: boolean
  emailVerified?: boolean
}

export interface UserFilters {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  status?: UserStatus
  organizationId?: string
  isActive?: boolean
  department?: string
}

export interface UsersResponse {
  message: string
  response: User[]
  pagination?: {
    pages: number
    page: number
    count: number
    perPage: number
  }
}

export interface UserResponse {
  message: string
  response: User
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  adminUsers: number
  regularUsers: number
  newUsersThisMonth: number
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordData {
  userId: string
  newPassword: string
  confirmPassword: string
}