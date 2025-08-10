import * as React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLogin } from '@/hooks/use-auth'
import { FormField } from '@/components/molecules/form-field'
import { LoginFormData, loginSchema } from '@/lib/validation'

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          error={errors.email?.message}
          {...register('email')}
          icon={<Mail className="w-4 h-4 text-muted-foreground" />}
        />

        <div className="relative">
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
            error={errors.password?.message}
            {...register('password')}
            icon={<Lock className="w-4 h-4 text-muted-foreground" />}
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

        <div className="flex items-center justify-between">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting || loginMutation.isPending}
          disabled={isSubmitting || loginMutation.isPending}
        >
          Sign In
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
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  )
}