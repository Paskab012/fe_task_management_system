import * as React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { generateAvatar } from '@/lib/utils'

export const Profile: React.FC = () => {
  const { user } = useAuthStore()

  if (!user) return null

  const { initials, className } = generateAvatar(`${user.firstName} ${user.lastName}`)

  return (
    <div className="p-4 space-y-6 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        <Button className="gap-2" variant="outline">
          <Settings className="w-4 h-4" />
          Edit Profile
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="bg-white border border-gray-200 lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className={`${className} text-white text-lg font-semibold`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 capitalize dark:text-gray-400">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Member since</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">18</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
            <div className="p-4 text-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}