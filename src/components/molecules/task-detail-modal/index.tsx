/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
//import { motion } from 'framer-motion'
import { 
  X, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  Flag, 
  Clock,
  Tag,
  Building
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
import { Task, TaskStatus, TaskPriority } from '@/types/task.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

interface TaskDetailModalProps {
  task: Task
  open: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    case TaskStatus.IN_REVIEW:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    case TaskStatus.DONE:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.LOW:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    case TaskPriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    case TaskPriority.HIGH:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
    case TaskPriority.URGENT:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuthStore()
  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
  const canEdit = isAdmin || task.createdById === user?.id || task.assignedUserId === user?.id
  const canDelete = isAdmin || task.createdById === user?.id

  // State for confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false)

  const assignedUserAvatar = task.assignedUser 
    ? generateAvatar(`${task.assignedUser.firstName} ${task.assignedUser.lastName}`)
    : null

  const createdByAvatar = task.createdBy 
    ? generateAvatar(`${task.createdBy.firstName} ${task.createdBy.lastName}`)
    : null

  const handleDelete = () => {
    console.log('🗑️ TaskDetailModal delete button clicked for task:', task.id)
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {task.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getStatusColor(task.status)} text-xs`}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                  </Badge>
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

          <div className="space-y-6">
            {/* Description */}
            {task.description && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap dark:text-gray-400">
                  {task.description}
                </p>
              </div>
            )}

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Board */}
              {task.board && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                    <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Board</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.board.name}
                    </p>
                  </div>
                </div>
              )}

              {task.assignedUser ? (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={task.assignedUser.avatar} />
                    <AvatarFallback className={`${assignedUserAvatar?.className} text-white text-xs`}>
                      {assignedUserAvatar?.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Assigned to</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.assignedUser.firstName} {task.assignedUser.lastName}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Assigned to</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Unassigned</p>
                  </div>
                </div>
              )}

              {task.createdBy && (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={task.createdBy.avatar} />
                    <AvatarFallback className={`${createdByAvatar?.className} text-white text-xs`}>
                      {createdByAvatar?.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created by</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.createdBy.firstName} {task.createdBy.lastName}
                    </p>
                  </div>
                </div>
              )}

              {/* Estimated Hours */}
              {task.estimatedHours && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Hours</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.estimatedHours}h
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              {task.startDate && (
                <div>
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(task.startDate)}
                    </span>
                  </div>
                </div>
              )}

              {task.dueDate && (
                <div>
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              )}

              {task.completedAt && (
                <div>
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(task.completedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {task.parentTask && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Parent Task</p>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.parentTask.title}
                  </p>
                </div>
              </div>
            )}

            {task.subTasks && task.subTasks.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Subtasks ({task.subTasks.length})
                </p>
                <div className="space-y-2">
                  {task.subTasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {subtask.title}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(subtask.status)} text-xs`}>
                        {subtask.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`${getPriorityColor(subtask.priority)} text-xs`}>
                        {subtask.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <p>Created: {formatDateTime(task.createdAt)}</p>
              <p>Updated: {formatDateTime(task.updatedAt)}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}