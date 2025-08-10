/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
//import { motion } from 'framer-motion'
import { User, Mail, Briefcase, MapPin, Phone, Building, Save } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Label,
  Input,
  Badge,
  Switch,
   Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { useUpdateUser } from '@/hooks/use-users'
import { User as UserType, UpdateUserData, UserRole, UserStatus } from '@/types/user.types'
import { useAuthStore } from '@/stores/auth-store'
// import { b } from 'node_modules/framer-motion/dist/types.d-Cjd591yU'

const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
})

type UpdateUserFormData = z.infer<typeof updateUserSchema>

interface EditUserModalProps {
  user: UserType
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
    value: UserStatus.ACTIVE, 
    label: 'Active', 
    description: 'User can access the system',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
  },
  { 
    value: UserStatus.INACTIVE, 
    label: 'Inactive', 
    description: 'User account is disabled',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  },
  { 
    value: UserStatus.PENDING, 
    label: 'Pending', 
    description: 'Awaiting email verification',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  },
  { 
    value: UserStatus.SUSPENDED, 
    label: 'Suspended', 
    description: 'Temporarily blocked access',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  },
]

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, open, onClose }) => {
  const { user: currentUser } = useAuthStore()
  const updateUserMutation = useUpdateUser()

  const isAdmin = currentUser && ['super_admin', 'admin'].includes(currentUser.role)
  const isSuperAdmin = currentUser?.role === 'super_admin'
  const canEdit = isAdmin && (isSuperAdmin || user.role !== UserRole.SUPER_ADMIN)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      phoneNumber: user.phone || '',
      jobTitle: user.jobTitle || '',
      department: user.department || '',
      location: user.location || '',
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        phoneNumber: user.phone || '',
        jobTitle: user.jobTitle || '',
        department: user.department || '',
        location: user.location || '',
        isActive: user.isActive,
        emailVerified: user.emailVerified,
      })
    }
  }, [open, user, reset])

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!canEdit) return

    try {
      const updateData: UpdateUserData = {
        ...data,
        phoneNumber: data.phoneNumber || undefined,
        jobTitle: data.jobTitle || undefined,
        department: data.department || undefined,
        location: data.location || undefined,
      }

      await updateUserMutation.mutateAsync({ id: user.id, data: updateData })
      onClose()
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  if (!canEdit) {
    return null
  }

  // Filter role options based on current user's role
  const availableRoles = isSuperAdmin 
    ? roleOptions 
    : roleOptions.filter(role => role.value !== UserRole.SUPER_ADMIN)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            Edit User
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
                  value={user.role}
                  onValueChange={(value) => setValue('role', value as UserRole)}>
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
                 value={user.status}
                 onValueChange={(value) => setValue('status', value as UserStatus)}
               >
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {statusOptions.map((status) => (
                     <SelectItem key={status.value} value={status.value}>
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

           {/* Account Toggles */}
           <div className="p-4 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-800">
             <div className="flex items-center justify-between">
               <div>
                 <Label className="text-sm font-medium">Account Active</Label>
                 <p className="text-xs text-gray-500 dark:text-gray-400">
                   User can access the system when active
                 </p>
               </div>
               <Switch
                 checked={watch('isActive')}
                 onCheckedChange={(checked: boolean) => setValue('isActive', checked)}
               />
             </div>

             {isSuperAdmin && (
               <div className="flex items-center justify-between">
                 <div>
                   <Label className="text-sm font-medium">Email Verified</Label>
                   <p className="text-xs text-gray-500 dark:text-gray-400">
                     Mark email as verified manually
                   </p>
                 </div>
                 <Switch
                   checked={watch('emailVerified')}
                   onCheckedChange={(checked : boolean) => setValue('emailVerified', checked)}
                 />
               </div>
             )}
           </div>
         </div>

         {/* Work Information */}
         <div className="space-y-4">
           <h3 className="text-lg font-medium text-gray-900 dark:text-white">
             Work Information
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

           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-medium">
                 <Phone className="w-4 h-4" />
                 Phone Number
               </Label>
               <Input
                 id="phoneNumber"
                 placeholder="+1 (555) 123-4567"
                 {...register('phoneNumber')}
               />
             </div>

             <div className="space-y-2">
               <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                 <MapPin className="w-4 h-4" />
                 Location
               </Label>
               <Input
                 id="location"
                 placeholder="New York, NY"
                 {...register('location')}
               />
             </div>
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
                 <Badge className={statusOptions.find(s => s.value === watch('status'))?.color}>
                   {statusOptions.find(s => s.value === watch('status'))?.label}
                 </Badge>
                 {!watch('isActive') && (
                   <Badge variant="outline" className="text-xs text-red-600">
                     Inactive
                   </Badge>
                 )}
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
             className="flex-1 bg-orange-500 hover:bg-orange-600"
             loading={isSubmitting || updateUserMutation.isPending}
             disabled={isSubmitting || updateUserMutation.isPending}
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