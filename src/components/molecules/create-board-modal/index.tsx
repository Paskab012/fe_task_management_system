import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// //import { motion } from 'framer-motion'
import { Palette, Building, Globe, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { useCreateBoard } from '@/hooks/use-boards'
import { CreateBoardData, BoardVisibility } from '@/types/board.types'
import { useAuthStore } from '@/stores/auth-store'

const createBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  visibility: z.nativeEnum(BoardVisibility).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
})

type CreateBoardFormData = z.infer<typeof createBoardSchema>

interface CreateBoardModalProps {
  open: boolean
  onClose: () => void
}

const visibilityOptions = [
  { 
    value: BoardVisibility.PUBLIC, 
    label: 'Public', 
    description: 'Anyone can view this board',
    icon: Globe,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
  },
  { 
    value: BoardVisibility.PRIVATE, 
    label: 'Private', 
    description: 'Only you and invited members can access',
    icon: Lock,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  },
  { 
    value: BoardVisibility.ORGANIZATION, 
    label: 'Organization', 
    description: 'Visible to your organization members',
    icon: Building,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  },
]

const colorOptions = [
  { value: '#3B82F6', name: 'Blue', class: 'bg-blue-500' },
  { value: '#EF4444', name: 'Red', class: 'bg-red-500' },
  { value: '#10B981', name: 'Green', class: 'bg-green-500' },
  { value: '#F59E0B', name: 'Yellow', class: 'bg-yellow-500' },
  { value: '#8B5CF6', name: 'Purple', class: 'bg-purple-500' },
  { value: '#EC4899', name: 'Pink', class: 'bg-pink-500' },
  { value: '#6B7280', name: 'Gray', class: 'bg-gray-500' },
  { value: '#F97316', name: 'Orange', class: 'bg-orange-500' },
]

const iconOptions = [
  '📋', '📊', '🎯', '🚀', '💼', '🔧', '🎨', '📱', '🌟', '⚡', '🏆', '📈'
]

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ open, onClose }) => {
  const { user } = useAuthStore()
  const createBoardMutation = useCreateBoard()
  const [selectedColor, setSelectedColor] = React.useState('#3B82F6')
  const [selectedIcon, setSelectedIcon] = React.useState('📋')

  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      visibility: BoardVisibility.ORGANIZATION,
      color: '#3B82F6',
      icon: '📋',
    },
  })

  const selectedVisibility = watch('visibility')

  React.useEffect(() => {
    if (open) {
      reset({
        visibility: BoardVisibility.ORGANIZATION,
        color: '#3B82F6',
        icon: '📋',
      })
      setSelectedColor('#3B82F6')
      setSelectedIcon('📋')
    }
  }, [open, reset])

  const onSubmit = async (data: CreateBoardFormData) => {
    if (!isAdmin) {
      return
    }

    try {
      const boardData: CreateBoardData = {
        ...data,
        color: selectedColor,
        icon: selectedIcon,
        organizationId: user?.organizationId,
      }

      await createBoardMutation.mutateAsync(boardData)
      onClose()
    } catch (error) {
      console.error('Failed to create board:', error)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div 
              className="flex items-center justify-center p-2 rounded-lg"
              style={{ backgroundColor: selectedColor + '20', color: selectedColor }}
            >
              <span className="text-lg">{selectedIcon}</span>
            </div>
            Create New Board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Board Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter board name..."
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter board description..."
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibility</Label>
            <Select 
              defaultValue={BoardVisibility.ORGANIZATION}
              onValueChange={(value : BoardVisibility) => setValue('visibility', value as BoardVisibility)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-3 py-1">
                        <IconComponent className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option.label}</span>
                            <Badge className={`${option.color} text-xs`}>
                              {option.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Palette className="w-4 h-4" />
              Board Color
            </Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color.value)
                    setValue('color', color.value)
                  }}
                  className={`
                    w-8 h-8 rounded-full ${color.class} relative
                    ${selectedColor === color.value ? 'ring-2 ring-gray-400 ring-offset-2' : ''}
                    hover:scale-110 transition-transform
                  `}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Board Icon</Label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(icon)
                    setValue('icon', icon)
                  }}
                  className={`
                    w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg
                    ${selectedIcon === icon 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                    transition-colors
                  `}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preview</p>
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-lg"
                style={{ backgroundColor: selectedColor + '20' }}
              >
                <span className="text-xl">{selectedIcon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {watch('name') || 'Board Name'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {watch('description') || 'Board description will appear here'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedVisibility && (
                    <Badge className={visibilityOptions.find(v => v.value === selectedVisibility)?.color}>
                      {visibilityOptions.find(v => v.value === selectedVisibility)?.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

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
              className="flex-1"
              style={{ backgroundColor: selectedColor }}
              loading={isSubmitting || createBoardMutation.isPending}
              disabled={isSubmitting || createBoardMutation.isPending}
            >
              Create Board
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}