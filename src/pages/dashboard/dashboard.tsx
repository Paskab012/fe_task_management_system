import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckSquare, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { CreateTaskModal } from '@/components/molecules'

interface StatCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

const stats: StatCard[] = [
  {
    title: 'Total Tasks',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: CheckSquare,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Completed',
    value: '18',
    change: '+8%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    title: 'Due Today',
    value: '3',
    change: '+2',
    trend: 'neutral',
    icon: Calendar,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    title: 'In Progress',
    value: '6',
    change: '-1',
    trend: 'down',
    icon: Clock,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
]

const recentTasks = [
  {
    id: 1,
    title: 'Update user authentication',
    status: 'completed',
    time: '2 hours ago',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Design dashboard wireframes',
    status: 'in-progress',
    time: '4 hours ago',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Setup CI/CD pipeline',
    status: 'pending',
    time: '1 day ago',
    priority: 'low'
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'pending':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore()
  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
  
  const [createTaskModalOpen, setCreateTaskModalOpen] = React.useState(false)

  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your tasks today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="transition-shadow duration-200 bg-white border border-gray-200 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        stat.trend === 'up' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : stat.trend === 'down'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-gray-500 dark:text-gray-400">from last week</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Recent Tasks</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your latest task updates and activities
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.time}
                        </p>
                      </div>
                      <div className="flex items-center ml-4 space-x-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Get started with these common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isAdmin && (
                    <Button 
                      className="justify-start w-full gap-3 text-white bg-blue-500 hover:bg-blue-600"
                      onClick={() => setCreateTaskModalOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Create New Task
                    </Button>
                  )}
                  <Button variant="outline" className="justify-start w-full gap-3">
                    <Users className="w-4 h-4" />
                    View Team Tasks
                  </Button>
                  <Button variant="outline" className="justify-start w-full gap-3">
                    <Calendar className="w-4 h-4" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="justify-start w-full gap-3">
                    <TrendingUp className="w-4 h-4" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
      />
    </>
  )
}