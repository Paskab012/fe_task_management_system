import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Grid, List } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Boards: React.FC = () => {
  return (
    <div className="p-4 space-y-6 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Boards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your work with Kanban boards
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="w-4 h-4" />
          </Button>
          <Button className="gap-2 text-white bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            New Board
          </Button>
        </div>
      </motion.div>

      <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Your Boards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            No boards found. Create your first board to get started!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}