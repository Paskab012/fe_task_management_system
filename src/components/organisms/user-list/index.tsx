import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Users,
  Edit,
  Trash2,
  Shield,
  Activity,
  Download,
  UserCheck,
  UserX
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  useUsers, 
  useDeleteUser, 
  useToggleUserStatus,
} from '@/hooks/use-users'
import { User, UserRole, UserStatus, UserFilters } from '@/types/user.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'
import { CreateUserModal, EditUserModal, UserDetailModal } from '@/components/molecules'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    case UserRole.ADMIN:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
    case UserRole.USER:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    case UserRole.GUEST:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    case UserStatus.INACTIVE:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    case UserStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    case UserStatus.SUSPENDED:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onToggleStatus: (userId: string, isActive: boolean) => void
  onViewDetails: (user: User) => void
  onViewActivity: (user: User) => void
  isSelected: boolean
  onSelect: (userId: string, selected: boolean) => void
  isAdmin: boolean
  isSuperAdmin: boolean
  currentUserId: string
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
  onViewActivity,
  isSelected,
  onSelect,
  isAdmin,
  isSuperAdmin,
  currentUserId,
}) => {
  const canEdit = isAdmin && (isSuperAdmin || user.role !== UserRole.SUPER_ADMIN)
  const canDelete = isSuperAdmin && user.id !== currentUserId
  const canToggleStatus = isAdmin && user.id !== currentUserId

  const userAvatar = generateAvatar(`${user.firstName} ${user.lastName}`)

  console.log('user =====:>> ', user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1 min-w-0 gap-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(user.id, !!checked)}
                className="mt-1"
              />
              
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className={`${userAvatar.className} text-white text-sm font-semibold`}>
                  {userAvatar.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0" onClick={() => onViewDetails(user)}>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-900 capitalize truncate dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  {!user.emailVerified && (
                    <Badge variant="outline" className="text-xs">
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate dark:text-gray-400">
                  {user.email}
                </p>
                {user.jobTitle && (
                  <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                    {user.jobTitle} {user.department && `• ${user.department}`}
                  </p>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-8 h-8 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(user)}>
                  <Users className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewActivity(user)}>
                  <Activity className="w-4 h-4 mr-2" />
                  View Activity
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </DropdownMenuItem>
                )}
                {canToggleStatus && (
                  <DropdownMenuItem 
                    onClick={() => onToggleStatus(user.id, !user.isActive)}
                  >
                    {user.isActive ? (
                      <>
                        <UserX className="w-4 h-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {canDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(user.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0" onClick={() => onViewDetails(user)}>
          {/* Role and Status */}
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${getRoleColor(user.role)} text-xs`}>
              {user.role.replace('_', ' ')}
            </Badge>
            <Badge className={`${getStatusColor(user.status)} text-xs`}>
              {user.status}
            </Badge>
            {!user.isActive && (
              <Badge variant="outline" className="text-xs text-red-600">
                Inactive
              </Badge>
            )}
          </div>

          {/* Contact Information */}
          {user.phone && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                📞 {user.phone}
              </span>
            </div>
          )}

          {user.location && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                📍 {user.location}
              </span>
            </div>
          )}

          {/* Last Login */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last login: {formatDate(user.lastLoginAt)}
          </div>

          {/* Stats */}
          {user._count && (
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{user._count.createdTasks} tasks created</span>
              <span>{user._count.assignedTasks} assigned</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const UserList: React.FC = () => {
  const { user: currentUser } = useAuthStore()
  const isAdmin = currentUser && ['super_admin', 'admin'].includes(currentUser.role)
  const isSuperAdmin = currentUser?.role === 'super_admin'

  // State
  const [filters, setFilters] = React.useState<UserFilters>({
    page: 1,
    limit: 20,
  })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedRole, setSelectedRole] = React.useState<UserRole | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<UserStatus | 'all'>('all')
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])

  // Modals
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [detailModalOpen, setDetailModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [userToDelete, setUserToDelete] = React.useState<{ id: string; name: string } | null>(null)

  // API calls
  const { data: usersData, isLoading, error } = useUsers(filters)
  const deleteUserMutation = useDeleteUser()
  const toggleStatusMutation = useToggleUserStatus()

  // Update filters when search/filter changes
  React.useEffect(() => {
    const newFilters: UserFilters = {
      page: 1,
      limit: 20,
    }

    if (searchQuery.trim()) {
      newFilters.search = searchQuery.trim()
    }
    if (selectedRole !== 'all') {
      newFilters.role = selectedRole as UserRole
    }
    if (selectedStatus !== 'all') {
      newFilters.status = selectedStatus as UserStatus
    }

    setFilters(newFilters)
  }, [searchQuery, selectedRole, selectedStatus])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDelete = async (userId: string) => {
    console.log('🗑️ Delete handler called for user:', userId)
    const user = usersData?.response.find(u => u.id === userId)
    if (user) {
      setUserToDelete({ id: userId, name: `${user.firstName} ${user.lastName}` })
      setDeleteConfirmationOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        console.log('✅ User confirmed deletion, proceeding...')
        
        await deleteUserMutation.mutateAsync(userToDelete.id)
        
        console.log('✅ User deletion completed')
      } catch (error) {
        console.error('💥 Error in delete handler:', error)
      } finally {
        setUserToDelete(null)
        setDeleteConfirmationOpen(false)
      }
    }
  }

  const handleCancelDelete = () => {
    console.log('❌ User cancelled deletion')
    setUserToDelete(null)
    setDeleteConfirmationOpen(false)
  }

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    await toggleStatusMutation.mutateAsync({ id: userId, isActive })
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setDetailModalOpen(true)
  }

  const handleViewActivity = (user: User) => {
    setSelectedUser(user)
    // Will implement activity modal later
  }

  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUsers(prev => 
      selected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected && usersData?.response) {
      setSelectedUsers(usersData.response.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  if (!isAdmin) {
    return (
      <div className="py-12 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          Access Denied
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          You don't have permission to manage users.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load users. Please try again.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="gap-2 text-white bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.values(UserRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {role.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as UserStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(UserStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Select All */}
        {usersData && usersData?.response.length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Checkbox
              checked={selectedUsers.length === usersData.response.length}
              indeterminate={selectedUsers.length > 0 && selectedUsers.length < usersData.response.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedUsers.length > 0 
                ? `${selectedUsers.length} of ${usersData.response.length} users selected`
                : `Select all ${usersData.response.length} users`
              }
            </span>
          </div>
        )}

        {/* User Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="w-16 h-5 bg-gray-200 rounded"></div>
                      <div className="w-12 h-5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : usersData?.response.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No users found
            </h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              {searchQuery || selectedRole !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters to see more users.'
                : 'Get started by creating your first user.'}
            </p>
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usersData?.response.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onViewDetails={handleViewDetails}
                onViewActivity={handleViewActivity}
                isSelected={selectedUsers.includes(user.id)}
                onSelect={handleSelectUser}
                isAdmin={!!isAdmin}
                isSuperAdmin={!!isSuperAdmin}
                currentUserId={currentUser?.id || ''}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {usersData?.pagination && usersData.pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {filters.page} of {usersData.pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
              disabled={filters.page === usersData.pagination.pages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Modals */}
        <CreateUserModal
          open={createModalOpen} 
          onClose={() => setCreateModalOpen(false)} 
        />
        
        {selectedUser && (
          <>
            <UserDetailModal
              user={selectedUser}
              open={detailModalOpen}
              onClose={() => {
                setDetailModalOpen(false)
                setSelectedUser(null)
              }}
              onEdit={() => {
                setDetailModalOpen(false)
                setEditModalOpen(true)
              }}
              onDelete={() => {
                setDetailModalOpen(false)
                handleDelete(selectedUser.id)
                setSelectedUser(null)
              }}
            />
            
            <EditUserModal
              user={selectedUser}
              open={editModalOpen}
              onClose={() => {
                setEditModalOpen(false)
                setSelectedUser(null)
              }}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <ConfirmationModal
          open={deleteConfirmationOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          description={`Are you sure you want to delete "${userToDelete.name}"? This action cannot be undone and will remove all user data.`}
          confirmText="Delete User"
          cancelText="Cancel"
          variant="destructive"
        />
      )}
    </>
  )
}