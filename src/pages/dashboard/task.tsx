import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Tasks: React.FC = () => {
  return (
    <div className="p-4 space-y-6 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your tasks efficiently
          </p>
        </div>
        <Button className="gap-2 text-white bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </motion.div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            No tasks found. Create your first task to get started!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}