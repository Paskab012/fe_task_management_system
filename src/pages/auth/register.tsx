import * as React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRegister } from '@/hooks/use-auth'
import { FormField } from '@/components/molecules/form-field'
import { RegisterFormData, registerSchema } from '@/lib/validation'

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Get started with your free account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            type="text"
            placeholder="John"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
            icon={<User className="w-4 h-4 text-muted-foreground" />}
          />
          <FormField
            label="Last Name"
            type="text"
            placeholder="Doe"
            required
            error={errors.lastName?.message}
            {...register('lastName')}
            icon={<User className="w-4 h-4 text-muted-foreground" />}
          />
        </div>

        <FormField
          label="Email"
          type="email"
          placeholder="john@example.com"
          required
          error={errors.email?.message}
          {...register('email')}
          icon={<Mail className="w-4 h-4 text-muted-foreground" />}
        />

        <div className="relative">
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            required
            error={errors.password?.message}
            {...register('password')}
            icon={<Lock className="w-4 h-4 text-muted-foreground" />}
            description="Must be at least 8 characters with uppercase, lowercase, and number"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute w-8 h-8 right-2 top-8"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting || registerMutation.isPending}
          disabled={isSubmitting || registerMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      <div className="relative">
        <Separator />
   <span className="absolute px-2 text-xs -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-background text-muted-foreground">
         Or
       </span>
     </div>

     <div className="text-center">
       <p className="text-sm text-muted-foreground">
         Already have an account?{' '}
         <Link
           to="/auth/login"
           className="font-medium text-primary hover:underline"
         >
           Sign in
         </Link>
       </p>
     </div>
   </motion.div>
 )
}