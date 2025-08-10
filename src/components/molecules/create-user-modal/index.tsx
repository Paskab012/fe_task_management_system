/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// //import { motion } from 'framer-motion'
import { User, Mail, Lock, Briefcase, Phone, Building } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useCreateUser } from '@/hooks/use-users'
import { CreateUserData, UserRole } from '@/types/user.types'
import { useAuthStore } from '@/stores/auth-store'

const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  role: z.nativeEnum(UserRole).optional(),
  phone: z.string().optional(), // Changed from phoneNumber to phone
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional(), 
  isEmailVerified: z.boolean().optional(), // Added for backend compatibility
})

type CreateUserFormData = z.infer<typeof createUserSchema>

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
}

const roleOptions = [
  { 
    value: UserRole.USER, 
    label: 'User', 
    description: 'Regular user with standard permissions',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  },
  { 
    value: UserRole.ADMIN, 
    label: 'Admin', 
    description: 'Administrator with elevated permissions',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
  },
  { 
    value: UserRole.SUPER_ADMIN, 
    label: 'Super Admin', 
    description: 'Full system access and control',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  },
  { 
    value: UserRole.GUEST, 
    label: 'Guest', 
    description: 'Limited read-only access',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  },
]

const statusOptions = [
  { 
    value: true, 
    label: 'Active', 
    description: 'User can access the system',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
  },
  { 
    value: false, 
    label: 'Inactive', 
    description: 'User account is disabled',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  },
]

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose }) => {
  const { user } = useAuthStore()
  const createUserMutation = useCreateUser()

  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
  const isSuperAdmin = user?.role === 'super_admin'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: UserRole.USER,
      isActive: true, 
      isEmailVerified: false,
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        role: UserRole.USER,
        isActive: true, 
        isEmailVerified: false,
      })
    }
  }, [open, reset])

  const onSubmit = async (data: CreateUserFormData) => {
    if (!isAdmin) return

    try {
      const userData: CreateUserData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role || UserRole.USER, 
        phone: data.phone || undefined,
        jobTitle: data.jobTitle || undefined,
        department: data.department || undefined,
        isActive: data.isActive ?? true, 
        // isEmailVerified: data.isEmailVerified ?? false,
        organizationId: user?.organizationId || undefined,
      }

      console.log('🚀 Sending user data to backend:', userData)
      await createUserMutation.mutateAsync(userData)
      onClose()
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  if (!isAdmin) {
    return null
  }

  const availableRoles = isSuperAdmin 
    ? roleOptions 
    : roleOptions.filter(role => role.value !== UserRole.SUPER_ADMIN)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            Create New User
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4" />
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4" />
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter secure password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Account Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <Select 
                  defaultValue={UserRole.USER}
                  onValueChange={(value) => setValue('role', value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-3 py-1">
                          <Badge className={`${role.color} text-xs`}>
                            {role.label}
                          </Badge>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select 
                  defaultValue="true"
                  onValueChange={(value) => setValue('isActive', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value.toString()} value={status.value.toString()}>
                        <div className="flex items-center gap-3 py-1">
                          <Badge className={`${status.color} text-xs`}>
                            {status.label}
                          </Badge>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {status.description}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Additional Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="w-4 h-4" />
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer"
                  {...register('jobTitle')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 text-sm font-medium">
                  <Building className="w-4 h-4" />
                  Department
                </Label>
                <Input
                  id="department"
                  placeholder="Engineering"
                  {...register('department')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                {...register('phone')}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preview</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                <span className="text-lg font-semibold text-blue-600">
                  {watch('firstName')?.[0]}{watch('lastName')?.[0]}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {watch('firstName')} {watch('lastName')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {watch('email')} • {watch('jobTitle') || 'No job title'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={roleOptions.find(r => r.value === watch('role'))?.color}>
                    {roleOptions.find(r => r.value === watch('role'))?.label}
                  </Badge>
                  <Badge className={statusOptions.find(s => s.value === watch('isActive'))?.color}>
                    {statusOptions.find(s => s.value === watch('isActive'))?.label}
                  </Badge>
                </div>
              </div>
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
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              loading={isSubmitting || createUserMutation.isPending}
              disabled={isSubmitting || createUserMutation.isPending}
            >
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}