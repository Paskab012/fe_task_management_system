import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/molecules'

export const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore()

  console.log('isAuthenticated ==:>> ', isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-secondary-100 dark:slate-400 ">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-elegant-lg glass-effect">
          <CardHeader className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center w-12 h-12 mx-auto rounded-full gradient-primary"
            >
              <span className="text-xl font-bold text-white">T</span>
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text">
                PacK AI
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Streamline your productivity
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}