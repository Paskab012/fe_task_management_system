/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
//mport { motion } from 'framer-motion'
import { X, Calendar, User, Flag, Clock, Save } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useUpdateTask, useUsers } from '@/hooks/use-tasks'
import { Task, UpdateTaskData, TaskStatus, TaskPriority } from '@/types/task.types'
import { useAuthStore } from '@/stores/auth-store'

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignedUserId: z.string().optional(),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
})

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>

interface EditTaskModalProps {
  task: Task
  open: boolean
  onClose: () => void
}

const statusOptions = [
  { value: TaskStatus.TODO, label: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: TaskStatus.IN_REVIEW, label: 'In Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: TaskStatus.DONE, label: 'Done', color: 'bg-green-100 text-green-800' },
]

const priorityOptions = [
  { value: TaskPriority.LOW, label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: TaskPriority.MEDIUM, label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: TaskPriority.HIGH, label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: TaskPriority.URGENT, label: 'Urgent', color: 'bg-red-100 text-red-800' },
]

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, open, onClose }) => {
  const { user } = useAuthStore()
  const updateTaskMutation = useUpdateTask()
  const { data: usersData, isLoading: usersLoading } = useUsers()
  const [tags, setTags] = React.useState<string[]>(task.tags || [])
  const [tagInput, setTagInput] = React.useState('')

  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
  const canEdit = isAdmin || task.createdById === user?.id || task.assignedUserId === user?.id

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignedUserId: task.assignedUserId || 'unassigned', // ← Fixed: use 'unassigned' instead of ''
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      startDate: task.startDate ? task.startDate.split('T')[0] : '',
      estimatedHours: task.estimatedHours || undefined,
      tags: task.tags || [],
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignedUserId: task.assignedUserId || 'unassigned', // ← Fixed: use 'unassigned' instead of ''
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        startDate: task.startDate ? task.startDate.split('T')[0] : '',
        estimatedHours: task.estimatedHours || undefined,
        tags: task.tags || [],
      })
      setTags(task.tags || [])
      setTagInput('')
    }
  }, [open, task, reset])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag]
        setTags(updatedTags)
        setValue('tags', updatedTags)
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove)
    setTags(updatedTags)
    setValue('tags', updatedTags)
  }

  const onSubmit = async (data: UpdateTaskFormData) => {
    if (!canEdit) {
      return
    }

    try {
      const updateData: UpdateTaskData = {
        ...data,
        tags: tags,
        estimatedHours: data.estimatedHours || undefined,
        dueDate: data.dueDate || undefined,
        startDate: data.startDate || undefined,
        assignedUserId: data.assignedUserId === 'unassigned' ? undefined : data.assignedUserId, // ← Fixed: convert 'unassigned' back to undefined
      }

      await updateTaskMutation.mutateAsync({ id: task.id, data: updateData })
      onClose()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  if (!canEdit) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flag className="w-5 h-5 text-orange-600" />
            </div>
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select 
                value={task.status}
                onValueChange={(value) => setValue('status', value as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <Badge className={`${option.color} text-xs`}>
                        {option.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select 
                value={task.priority}
                onValueChange={(value) => setValue('priority', value as TaskPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <Badge className={`${option.color} text-xs`}>
                        {option.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assign User (Admin only) */}
          {isAdmin && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Assign to User
              </Label>
              <Select 
                value={task.assignedUserId || 'unassigned'} // ← Fixed: use 'unassigned' instead of ''
                onValueChange={(value) => setValue('assignedUserId', value === 'unassigned' ? undefined : value)} // ← Fixed: convert back to undefined
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem> {/* ← Fixed: use 'unassigned' instead of '' */}
                  {usersLoading ? (
                    <SelectItem value="loading" disabled>Loading users...</SelectItem>
                  ) : (
                    usersData?.response.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                            <span className="text-xs font-medium text-blue-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          {user.firstName} {user.lastName}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
              />
            </div>
          </div>

          {/* Estimated Hours */}
          <div className="space-y-2">
            <Label htmlFor="estimatedHours" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4" />
             Estimated Hours
           </Label>
           <Input
             id="estimatedHours"
             type="number"
             min="0"
             step="0.5"
             placeholder="e.g. 8"
             {...register('estimatedHours', { valueAsNumber: true })}
           />
         </div>

         {/* Tags */}
         <div className="space-y-2">
           <Label className="text-sm font-medium">Tags</Label>
           <div className="space-y-2">
             <Input
               value={tagInput}
               onChange={(e) => setTagInput(e.target.value)}
               onKeyDown={handleAddTag}
               placeholder="Type a tag and press Enter..."
             />
             {tags.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {tags.map((tag) => (
                   <Badge
                     key={tag}
                     variant="secondary"
                     className="flex items-center gap-1"
                   >
                     {tag}
                     <button
                       type="button"
                       onClick={() => handleRemoveTag(tag)}
                       className="ml-1 hover:text-red-500"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   </Badge>
                 ))}
               </div>
             )}
           </div>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-3 pt-4">
           <Button
             type="button"
             variant="outline"
             onClick={onClose}
             className="flex-1"
           >
             Cancel
           </Button>
           <Button
             type="submit"
             className="flex-1 bg-orange-500 hover:bg-orange-600"
             loading={isSubmitting || updateTaskMutation.isPending}
             disabled={isSubmitting || updateTaskMutation.isPending}
           >
             <Save className="w-4 h-4 mr-2" />
             Save Changes
           </Button>
         </div>
       </form>
     </DialogContent>
   </Dialog>
 )
}