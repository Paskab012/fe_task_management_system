import * as React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Card, CardContent } from '@/components/ui/card'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[]
  fallback?: string
  requireAuth?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  fallback = '/auth/login',
  requireAuth = true,
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 text-center"
        >
          <Card className="p-8 bg-white border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-0 space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Loading...
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we verify your access
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (requireAuth && (!isAuthenticated || !user)) {
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-4 text-center"
        >
          <Card className="p-8 bg-white border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-0 space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/20">
                  <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Access Denied
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You don't have permission to access this area. Please contact your administrator if you believe this is an error.
                </p>
              </div>
              <div className="pt-2">
                <Navigate to="/dashboard" replace />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute roles={['super_admin', 'admin']}>
    {children}
  </ProtectedRoute>
)

export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute roles={['super_admin']}>
    {children}
  </ProtectedRoute>
)

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute roles={['super_admin', 'admin', 'user']}>
    {children}
  </ProtectedRoute>
)

export const PublicRoute: React.FC<{ 
  children: React.ReactNode
  redirectTo?: string 
}> = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}