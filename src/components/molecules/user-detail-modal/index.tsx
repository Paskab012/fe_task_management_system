/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
// import { motion } from 'framer-motion'
import {  
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  MapPin,
  Briefcase,
  Building,
  Calendar,
  Activity,
  Shield,
  Key,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, UserRole, UserStatus } from '@/types/user.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'
import { useUserActivity } from '@/hooks/use-users'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

interface UserDetailModalProps {
  user: User
  open: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

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

const getRoleDescription = (role: UserRole) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'Full system access and control'
    case UserRole.ADMIN:
      return 'Administrator with elevated permissions'
    case UserRole.USER:
      return 'Regular user with standard permissions'
    case UserRole.GUEST:
      return 'Limited read-only access'
    default:
      return ''
  }
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { user: currentUser } = useAuthStore()
  const { data: activityData } = useUserActivity(user.id)
  
  const isAdmin = currentUser && ['super_admin', 'admin'].includes(currentUser.role)
  const isSuperAdmin = currentUser?.role === 'super_admin'
  const canEdit = isAdmin && (isSuperAdmin || user.role !== UserRole.SUPER_ADMIN)
  const canDelete = isSuperAdmin && user.id !== currentUser?.id

  // State for confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false)

  const userAvatar = generateAvatar(`${user.firstName} ${user.lastName}`)

  const handleDelete = () => {
    console.log('🗑️ UserDetailModal delete button clicked for user:', user.id)
    setShowDeleteConfirmation(true)
  }

  const handleConfirmDelete = () => {
    console.log('✅ User confirmed deletion from modal')
    onClose() // Close main modal first
    onDelete() // Then trigger deletion
  }

  const handleCancelDelete = () => {
    console.log('❌ User cancelled deletion from modal')
    setShowDeleteConfirmation(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center flex-1 min-w-0 gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className={`${userAvatar.className} text-white text-lg font-semibold`}>
                    {userAvatar.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </DialogTitle>
                  <p className="mb-2 text-gray-600 dark:text-gray-400">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`${getRoleColor(user.role)} text-xs`}>
                      <Shield className="w-3 h-3 mr-1" />
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
                    {!user.emailVerified && (
                      <Badge variant="outline" className="text-xs text-yellow-600">
                        Unverified Email
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:bg-red-50 hover:border-red-200">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Personal Information */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                        {user.emailVerified ? (
                          <p className="text-xs text-green-600">Verified</p>
                        ) : (
                          <p className="text-xs text-yellow-600">Unverified</p>
                        )}
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                          <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.location && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.location}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Member since</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Information */}
              {(user.jobTitle || user.department || user.organization) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Work Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.jobTitle && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                            <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Job Title</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.jobTitle}
                            </p>
                          </div>
                        </div>
                      )}

                      {user.department && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg dark:bg-indigo-900">
                            <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.department}
                            </p>
                          </div>
                        </div>
                      )}

                      {user.organization && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pink-100 rounded-lg dark:bg-pink-900">
                            <Building className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Organization</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.organization.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Role & Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Role & Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900">
                      <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.role.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getRoleDescription(user.role)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                      {user.isActive ? (
                        <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <UserX className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Account Status</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.isActive ? 'User can access the system' : 'User cannot access the system'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Statistics & Activity */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user._count && (
                    <>
                      <div className="p-4 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {user._count.createdTasks}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Created</p>
                      </div>
                      <div className="p-4 text-center rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {user._count.assignedTasks}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Assigned</p>
                      </div>
                      <div className="p-4 text-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {user._count.createdBoards}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Boards Created</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium">Last Login</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {formatDateTime(user.lastLoginAt)}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {activityData?.response?.length > 0 ? (
                      activityData.response.slice(0, 5).map((activity: any, index: any) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {formatDateTime(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="justify-start w-full gap-2">
                      <Key className="w-4 h-4" />
                      Reset Password
                    </Button>
                    {!user.emailVerified && (
                      <Button variant="outline" size="sm" className="justify-start w-full gap-2">
                        <Mail className="w-4 h-4" />
                        Send Verification
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start w-full gap-2"
                    >
                      {user.isActive ? (
                        <>
                          <UserX className="w-4 h-4" />
                          Deactivate Account
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Activate Account
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <Separator />
          <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
            <p>Created: {formatDateTime(user.createdAt)}</p>
            <p>Updated: {formatDateTime(user.updatedAt)}</p>
            {user.lastLoginAt && (
              <p>Last Login: {formatDateTime(user.lastLoginAt)}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete "${user.firstName} ${user.lastName}"? This action cannot be undone and will remove all user data including tasks, boards, and activity history.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}