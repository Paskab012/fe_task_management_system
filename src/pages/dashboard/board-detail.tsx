import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  Plus,
  Calendar,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBoard } from '@/hooks/use-boards'
import { BoardVisibility } from '@/types/board.types'
import { useAuthStore } from '@/stores/auth-store'
import { CreateTaskModal } from '@/components/molecules' // Import the modal

const getVisibilityColor = (visibility: BoardVisibility) => {
  switch (visibility) {
    case BoardVisibility.PUBLIC:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    case BoardVisibility.PRIVATE:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    case BoardVisibility.ORGANIZATION:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

export const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: boardData, isLoading, error } = useBoard(boardId!)

  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)

  // Modal state
  const [createTaskModalOpen, setCreateTaskModalOpen] = React.useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 mx-auto border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading board...</p>
        </div>
      </div>
    )
  }

  if (error || !boardData?.response) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load board. Please try again.</p>
        <Button onClick={() => navigate('/dashboard/boards')} className="mt-4">
          Back to Boards
        </Button>
      </div>
    )
  }

  const board = boardData.response

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/boards')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div 
            className="flex items-center justify-center w-12 h-12 text-xl rounded-xl"
            style={{ backgroundColor: (board.color || '#3B82F6') + '20' }}
          >
            {board.icon || '📋'}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {board.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getVisibilityColor(board.visibility)} text-xs`}>
                {board.visibility}
              </Badge>
              {board.isArchived && (
                <Badge variant="secondary" className="text-xs">
                  Archived
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Members
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {board.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <p className="text-gray-700 dark:text-gray-300">{board.description}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input 
                placeholder="Search tasks in this board..." 
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              {isAdmin && (
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => setCreateTaskModalOpen(true)} // ← Added onClick handler
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {['To Do', 'In Progress', 'In Review', 'Done'].map((status, index) => (
              <Card key={status} className="bg-gray-50 dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    {status}
                    <Badge variant="secondary" className="text-xs">
                      0
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks</p>
                    {isAdmin && index === 0 && (
                      <Button variant="ghost" size="sm" className="mt-2"
                        onClick={() => setCreateTaskModalOpen(true)} // ← Added onClick handler
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add task
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="py-12 text-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              Tasks will appear here
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Once task integration is complete, you'll see all tasks for this board organized by status.
            </p>
            {isAdmin && (
              <Button className="gap-2"
                onClick={() => setCreateTaskModalOpen(true)} // ← Added onClick handler
              >
                <Plus className="w-4 h-4" />
                Create First Task
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        defaultBoardId={boardId} // Pass the current board ID as default
      />
    </>
  )
}