import * as React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAssignTask, useUsers } from '@/hooks/use-tasks'
import { Task } from '@/types/task.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'

interface AssignTaskModalProps {
  task: Task
  open: boolean
  onClose: () => void
}

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ task, open, onClose }) => {
  const { user } = useAuthStore()
  const assignTaskMutation = useAssignTask()
  const { data: usersData, isLoading: usersLoading } = useUsers()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedUserId, setSelectedUserId] = React.useState<string>('')

  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)

  const filteredUsers = React.useMemo(() => {
    if (!usersData?.response) return []
    
    return usersData.response.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      const email = user.email.toLowerCase()
      const query = searchQuery.toLowerCase()
      
      return fullName.includes(query) || email.includes(query)
    })
  }, [usersData?.response, searchQuery])

  React.useEffect(() => {
    if (open) {
      setSearchQuery('')
      setSelectedUserId(task.assignedUserId || '')
    }
  }, [open, task.assignedUserId])

  const handleAssign = async () => {
    if (!selectedUserId || !isAdmin) return

    try {
      await assignTaskMutation.mutateAsync({ 
        taskId: task.id, 
        userId: selectedUserId 
      })
      onClose()
    } catch (error) {
      console.error('Failed to assign task:', error)
    }
  }

  const handleUnassign = async () => {
    if (!isAdmin) return

    try {
      await assignTaskMutation.mutateAsync({ 
        taskId: task.id, 
        userId: ''
      })
      onClose()
    } catch (error) {
      console.error('Failed to unassign task:', error)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            Assign Task
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Assign "{task.title}" to a team member
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Assignment */}
          {task.assignedUser && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="mb-2 text-xs text-blue-600 dark:text-blue-400">Currently assigned to:</p>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={task.assignedUser.avatar} />
                  <AvatarFallback className="text-xs text-blue-600 bg-blue-100">
                    {task.assignedUser.firstName[0]}{task.assignedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.assignedUser.firstName} {task.assignedUser.lastName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {task.assignedUser.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnassign}
                  loading={assignTaskMutation.isPending}
                >
                  Unassign
                </Button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* User List */}
          <div className="space-y-2 overflow-y-auto max-h-64">
            {usersLoading ? (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'No users found matching your search.' : 'No users available.'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const userAvatar = generateAvatar(`${user.firstName} ${user.lastName}`)
                const isSelected = selectedUserId === user.id
                const isCurrent = task.assignedUserId === user.id

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className={`${userAvatar.className} text-white text-xs`}>
                          {userAvatar.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          {isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate dark:text-gray-400">
                          {user.email}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs capitalize">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                      {isSelected && (
                        <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedUserId || selectedUserId === task.assignedUserId}
              loading={assignTaskMutation.isPending}
              className="flex-1 bg-purple-500 hover:bg-purple-600"
            >
              Assign Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}