import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  User,
  Calendar,
  Flag,
  Clock,
  Edit,
  Trash2,
  UserPlus
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
import { useTasks, useDeleteTask, useUpdateTaskStatus } from '@/hooks/use-tasks'
import { Task, TaskStatus, TaskPriority, TaskFilters } from '@/types/task.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'
import { AssignTaskModal, CreateTaskModal, EditTaskModal, TaskDetailModal } from '@/components/molecules'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onAssign: (task: Task) => void
  onViewDetails: (task: Task) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  isAdmin: boolean
  isGuest: boolean
  currentUserId: string
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onAssign,
  onViewDetails,
  onStatusChange,
  isAdmin,
  isGuest,
  currentUserId,
}) => {
  const canEdit = isAdmin || task.createdById === currentUserId || task.assignedUserId === currentUserId
  const canDelete = isAdmin || task.createdById === currentUserId
  const canAssign = isAdmin // Only admins can assign tasks
  const canChangeStatus = !isGuest && (isAdmin || task.assignedUserId === currentUserId)

  const assignedUserAvatar = task.assignedUser 
    ? generateAvatar(`${task.assignedUser.firstName} ${task.assignedUser.lastName}`)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="transition-all duration-200 cursor-pointer hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0" onClick={() => onViewDetails(task)}>
              <p className="font-semibold text-gray-400 uppercase capitalize truncate dark:text-primary">
                {task.title}
              </p>
              {task.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            
            {!isGuest && (canEdit || canDelete || canAssign) && (
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
                  <DropdownMenuItem onClick={() => onViewDetails(task)}>
                    View Details
                  </DropdownMenuItem>
                  {canEdit && (
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Task
                    </DropdownMenuItem>
                  )}
                  {canAssign && (
                    <DropdownMenuItem onClick={() => onAssign(task)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign User
                    </DropdownMenuItem>
                  )}
                  {(canEdit || canDelete || canAssign) && <DropdownMenuSeparator />}
                  {canDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(task.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0" onClick={() => onViewDetails(task)}>
          {/* Status and Priority */}
          <div className="flex items-center gap-2 mb-3">
            {canChangeStatus ? (
              <Select
                value={task.status}
                onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)}
              >
                <SelectTrigger className="w-auto text-xs h-7">
                  <Badge className={`${getStatusColor(task.status)} text-xs border-0`}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      <Badge className={`${getStatusColor(status)} text-xs`}>
                        {status.replace('_', ' ')}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge className={`${getStatusColor(task.status)} text-xs`}>
                {task.status.replace('_', ' ')}
              </Badge>
            )}

            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
              <Flag className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
          </div>

          {/* Assigned User */}
          {task.assignedUser && (
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={task.assignedUser.avatar} />
                  <AvatarFallback className={`${assignedUserAvatar?.className} text-white text-xs`}>
                    {assignedUserAvatar?.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {task.assignedUserId === currentUserId ? 'You' : `${task.assignedUser.firstName} ${task.assignedUser.lastName}`}
                </span>
              </div>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Due {formatDate(task.dueDate)}
              </span>
            </div>
          )}

          {/* Estimated Hours */}
          {task.estimatedHours && (
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {task.estimatedHours}h estimated
              </span>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const TaskList: React.FC = () => {
  const { user } = useAuthStore()
  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
  const isGuest = user?.role === 'guest'
  const isRegularUser = user?.role === 'user'

  // State
  const [filters, setFilters] = React.useState<TaskFilters>({
    page: 1,
    limit: 20,
    ...(isRegularUser && user?.id && { assignedUserId: user.id }),
  })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState<TaskStatus | 'all'>('all')
  const [selectedPriority, setSelectedPriority] = React.useState<TaskPriority | 'all'>('all')

  // Modals
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [detailModalOpen, setDetailModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [assignModalOpen, setAssignModalOpen] = React.useState(false)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = React.useState<string | null>(null)

  // API calls
  const { data: tasksData, isLoading, error } = useTasks(filters)
  const deleteTaskMutation = useDeleteTask()
  const updateStatusMutation = useUpdateTaskStatus()

  console.log('🔍 User role:', user?.role)
  console.log('📋 Task filters applied:', filters)
  console.log('📊 Tasks data received:', tasksData)

  React.useEffect(() => {
    const newFilters: TaskFilters = {
      page: 1,
      limit: 20,
      ...(isRegularUser && user?.id && { assignedUserId: user.id }),
    }

    if (searchQuery.trim()) {
      newFilters.search = searchQuery.trim()
    }
    if (selectedStatus !== 'all') {
      newFilters.status = selectedStatus as TaskStatus
    }
    if (selectedPriority !== 'all') {
      newFilters.priority = selectedPriority as TaskPriority
    }
    setFilters(newFilters)
  }, [searchQuery, selectedStatus, selectedPriority, isRegularUser, user?.id, user?.role])

  const filteredTasks = React.useMemo(() => {
    if (!tasksData?.response) return []
    
    let tasks = tasksData.response

    if (isRegularUser && user?.id) {
      tasks = tasks.filter(task => task.assignedUserId === user.id)
    } else if (isGuest) {
      tasks = []
    }

    return tasks
  }, [tasksData?.response, isRegularUser, isGuest, user?.id])

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setEditModalOpen(true)
  }

  const handleDelete = async (taskId: string) => {
    console.log('🗑️ Delete handler called for task:', taskId)
    setTaskToDelete(taskId)
    setDeleteConfirmationOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {        
        await deleteTaskMutation.mutateAsync(taskToDelete)
          } catch (error) {
        console.error('Error in delete handler:', error)
      } finally {
        setTaskToDelete(null)
        setDeleteConfirmationOpen(false)
      }
    }
  }

  const handleCancelDelete = () => {
    setTaskToDelete(null)
    setDeleteConfirmationOpen(false)
  }

  const handleAssign = (task: Task) => {
    setSelectedTask(task)
    setAssignModalOpen(true)
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setDetailModalOpen(true)
  }

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (isGuest) return 
    await updateStatusMutation.mutateAsync({ id: taskId, status })
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load tasks. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Tasks
            {isRegularUser && (
              <Badge variant="secondary" className="ml-2 text-xs">
                My Tasks
              </Badge>
            )}
            {isGuest && (
              <Badge variant="secondary" className="ml-2 text-xs">
                No Access
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRegularUser 
              ? 'Manage and track tasks assigned to you'
              : isGuest
                ? 'Tasks are not available for guest users'
                : 'Manage and track all tasks in your organization'
            }
          </p>
        </div>
        {isAdmin && !isGuest && (
          <Button 
            onClick={() => setCreateModalOpen(true)}
            className="gap-2 text-white bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </Button>
        )}
      </div>

      {!isGuest && (
        <>
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as TaskStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(TaskStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as TaskPriority | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {Object.values(TaskPriority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Grid */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-2">
                     <div className="w-full h-3 bg-gray-200 rounded"></div>
                     <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                     <div className="flex gap-2">
                       <div className="w-16 h-5 bg-gray-200 rounded"></div>
                       <div className="w-12 h-5 bg-gray-200 rounded"></div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
          ) : filteredTasks.length === 0 ? (
           <div className="py-12 text-center">
             <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
               <Flag className="w-12 h-12 text-gray-400" />
             </div>
             <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
               {isRegularUser ? 'No tasks assigned to you' : 'No tasks found'}
             </h3>
             <p className="mb-4 text-gray-500 dark:text-gray-400">
               {searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all'
                 ? 'Try adjusting your filters to see more tasks.'
                 : isRegularUser
                   ? 'You don\'t have any tasks assigned yet. Contact your admin to get tasks assigned.'
                   : 'Get started by creating your first task.'}
             </p>
             {isAdmin && (
               <Button 
                 onClick={() => setCreateModalOpen(true)}
                 className="gap-2"
               >
                 <Plus className="w-4 h-4" />
                 Create Task
               </Button>
             )}
           </div>
          ) : (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             {filteredTasks.map((task) => (
               <TaskCard
                 key={task.id}
                 task={task}
                 onEdit={handleEdit}
                 onDelete={handleDelete}
                 onAssign={handleAssign}
                 onViewDetails={handleViewDetails}
                 onStatusChange={handleStatusChange}
                 isAdmin={!!isAdmin}
                 isGuest={!!isGuest}
                 currentUserId={user?.id || ''}
               />
             ))}
           </div>
          )}

          {/* Pagination */}
          {tasksData?.pagination && tasksData.pagination.pages > 1 && (
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
                Page {filters.page} of {tasksData.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                disabled={filters.page === tasksData.pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Guest message */}
      {isGuest && (
        <div className="py-12 text-center">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
            <Flag className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Tasks not available
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Guest users do not have access to tasks. Please contact an administrator if you need access.
          </p>
        </div>
      )}

      {isAdmin && !isGuest && (
        <CreateTaskModal
          open={createModalOpen} 
          onClose={() => setCreateModalOpen(false)} 
        />
      )}
      
      {selectedTask && !isGuest && (
        <>
          <TaskDetailModal
            task={selectedTask}
            open={detailModalOpen}
            onClose={() => {
              setDetailModalOpen(false)
              setSelectedTask(null)
            }}
            onEdit={() => {
              setDetailModalOpen(false)
              setEditModalOpen(true)
            }}
            onDelete={() => {
              setDetailModalOpen(false)
              handleDelete(selectedTask.id)
              setSelectedTask(null)
            }}
          />
          
          {(isAdmin || selectedTask.createdById === user?.id || selectedTask.assignedUserId === user?.id) && (
            <EditTaskModal
              task={selectedTask}
              open={editModalOpen}
              onClose={() => {
                setEditModalOpen(false)
                setSelectedTask(null)
              }}
            />
          )}
          
          {isAdmin && (
            <AssignTaskModal
              task={selectedTask}
              open={assignModalOpen}
              onClose={() => {
                setAssignModalOpen(false)
                setSelectedTask(null)
              }}
            />
          )}
        </>
      )}

      {taskToDelete && !isGuest && (
        <ConfirmationModal
          open={deleteConfirmationOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Task"
          description={`Are you sure you want to delete this task? This action cannot be undone.`}
          confirmText="Delete Task"
          cancelText="Cancel"
          variant="destructive"
        />
      )}
    </div>
  )
}