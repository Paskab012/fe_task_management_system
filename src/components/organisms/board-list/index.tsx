/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Users,
  Calendar,
  Archive,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { 
  useBoards, 
  useDeleteBoard, 
  useArchiveBoard 
} from '@/hooks/use-boards'
import { Board, BoardVisibility, BoardFilters } from '@/types/board.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { CreateBoardModal } from '@/components/molecules/create-board-modal'
import { BoardDetailModal } from '@/components/molecules/board-detail-modal'
import { EditBoardModal } from '@/components/molecules'
import { BoardMembersModal } from '@/components/molecules/board-members-modal'

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

const getVisibilityIcon = (visibility: BoardVisibility) => {
  switch (visibility) {
    case BoardVisibility.PUBLIC:
      return '🌐'
    case BoardVisibility.PRIVATE:
      return '🔒'
    case BoardVisibility.ORGANIZATION:
      return '🏢'
    default:
      return '📋'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface BoardCardProps {
  board: Board
  onEdit: (board: Board) => void
  onDelete: (boardId: string) => void
  onManageMembers: (board: Board) => void
  onViewDetails: (board: Board) => void
  onArchive: (boardId: string, isArchived: boolean) => void
  onNavigate: (boardId: string) => void
  isAdmin: boolean
  isGuest: boolean
}

const BoardCard: React.FC<BoardCardProps> = ({
  board,
  onEdit,
  onDelete,
  onManageMembers,
  onViewDetails,
  onArchive,
  onNavigate,
  isAdmin,
  isGuest,
}) => {
  const { user } = useAuthStore()
  const canEdit = isAdmin || board.createdById === user?.id
  const canDelete = isAdmin || board.createdById === user?.id

  const createdByAvatar = board.createdBy 
    ? generateAvatar(`${board.createdBy.firstName} ${board.createdBy.lastName}`)
    : null

  const handleCopyLink = () => {
    const url = `${window.location.origin}/boards/${board.id}`
    navigator.clipboard.writeText(url)
    // You could add a toast here
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card 
        className={`
          hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden
          ${board.isArchived ? 'opacity-60' : ''}
        `}
      >
        {/* Color stripe */}
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: board.color || '#3B82F6' }}
        />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0" onClick={() => onNavigate(board.id)}>
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="flex items-center justify-center w-10 h-10 text-lg rounded-lg"
                  style={{ backgroundColor: (board.color || '#3B82F6') + '20' }}
                >
                  {board.icon || '📋'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 capitalize truncate dark:text-white">
                    {board.name}
                  </p>
                  {board.isArchived && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      <Archive className="w-3 h-3 mr-1" />
                      Archived
                    </Badge>
                  )}
                </div>
              </div>
              
              {board.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {board.description}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-8 h-8 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate(board.id)}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Board
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails(board)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                
                {!isGuest && (
                  <>
                    <DropdownMenuSeparator />
                    {canEdit && (
                      <DropdownMenuItem onClick={() => onEdit(board)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Board
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => onManageMembers(board)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                    )}
                    {canEdit && (
                      <DropdownMenuItem 
                        onClick={() => onArchive(board.id, !board.isArchived)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        {board.isArchived ? 'Unarchive' : 'Archive'}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {canDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(board.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0" onClick={() => onNavigate(board.id)}>
          {/* Visibility and Stats */}
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${getVisibilityColor(board.visibility)} text-xs`}>
              <span className="mr-1">{getVisibilityIcon(board.visibility)}</span>
              {board.visibility}
            </Badge>
            
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {board._count?.tasks !== undefined && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {board._count.tasks} tasks
                </div>
              )}
              {board._count?.members !== undefined && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {board._count.members} members
                </div>
              )}
            </div>
          </div>

          {/* Created By */}
          {board.createdBy && (
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={board.createdBy.avatar} />
                <AvatarFallback className={`${createdByAvatar?.className} text-white text-xs`}>
                  {createdByAvatar?.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Created by {board.createdBy.firstName} {board.createdBy.lastName}
              </span>
            </div>
          )}

          {/* Created Date */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Created {formatDate(board.createdAt)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const BoardList: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
  const isGuest = user?.role === 'guest'

  // State
  const [filters, setFilters] = React.useState<BoardFilters>({
    page: 1,
    limit: 20,
    isArchived: false,
  })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedVisibility, setSelectedVisibility] = React.useState<BoardVisibility | 'all'>('all')
  const [showArchived, setShowArchived] = React.useState(false)

  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [detailModalOpen, setDetailModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [membersModalOpen, setMembersModalOpen] = React.useState(false)
  const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null)

  const { data: boardsData, isLoading, error } = useBoards(filters)
  const deleteBoardMutation = useDeleteBoard()
  const archiveBoardMutation = useArchiveBoard()

  console.log('🔍 User role:', user?.role)
  console.log('📋 Raw boards data from backend:', boardsData)

  const filteredBoards = React.useMemo(() => {
    if (!boardsData?.response) return []
    
    let boards = boardsData.response

    if (isGuest) {
      boards = boards.filter(board => board.visibility === 'public')
      console.log(`🔒 Guest filtering: ${boards.length} public boards out of ${boardsData.response.length} total`)
    }

    return boards
  }, [boardsData?.response, isGuest])

  React.useEffect(() => {
    const newFilters: BoardFilters = {
      page: 1,
      limit: 20,
      isArchived: showArchived,
    }

    if (searchQuery.trim()) {
      newFilters.search = searchQuery.trim()
    }
    
    if (!isGuest && selectedVisibility !== 'all') {
      newFilters.visibility = selectedVisibility as BoardVisibility
    }

    console.log('🔍 Board filters for user role:', user?.role, newFilters)
    setFilters(newFilters)
  }, [searchQuery, selectedVisibility, showArchived, isGuest, user?.role])

  React.useEffect(() => {
    if (isGuest) {
      setSelectedVisibility('all')
    }
  }, [isGuest])

  const handleEdit = (board: Board) => {
    setSelectedBoard(board)
    setEditModalOpen(true)
  }

  const handleDelete = async (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      await deleteBoardMutation.mutateAsync(boardId)
    }
  }

  const handleManageMembers = (board: Board) => {
    setSelectedBoard(board)
    setMembersModalOpen(true)
  }

  const handleViewDetails = (board: Board) => {
    setSelectedBoard(board)
    setDetailModalOpen(true)
  }

  const handleArchive = async (boardId: string, isArchived: boolean) => {
    await archiveBoardMutation.mutateAsync({ id: boardId, isArchived })
  }

  const handleNavigate = (boardId: string) => {
    navigate(`/dashboard/boards/${boardId}`)
  }

  // Available visibility options based on user role
  const getAvailableVisibilityOptions = () => {
    if (isGuest) {
      // For guest users, show only "Public Boards" option
      return [
        { value: 'all', label: 'Public Boards', icon: getVisibilityIcon(BoardVisibility.PUBLIC) }
      ]
    }
    
    return [
      { value: 'all', label: 'All Visibility', icon: '📋' },
      ...Object.values(BoardVisibility).map((visibility) => ({
        value: visibility,
        label: visibility,
        icon: getVisibilityIcon(visibility)
      }))
    ]
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load boards. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Boards
            {isGuest && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Public Only
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isGuest 
              ? 'View public project boards available to everyone'
              : 'Organize your work with project boards'
            }
          </p>
        </div>
        {/* Only admins can create boards, guests cannot */}
        {isAdmin && !isGuest && (
          <Button 
            onClick={() => setCreateModalOpen(true)}
            className="gap-2 text-white bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Create Board
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input 
            placeholder={isGuest ? "Search public boards..." : "Search boards..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select 
          value={isGuest ? 'all' : selectedVisibility} 
          onValueChange={(value) => {
            // Guests cannot change visibility (already filtered to public)
            if (!isGuest) {
              setSelectedVisibility(value as BoardVisibility | 'all')
            }
          }}
          disabled={isGuest} // Disable for guest users
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Visibility" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableVisibilityOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Hide archived filter for guests */}
        {!isGuest && (
          <Select 
            value={showArchived ? 'archived' : 'active'} 
            onValueChange={(value: string) => setShowArchived(value === 'archived')}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Boards</SelectItem>
              <SelectItem value="archived">Archived Boards</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Board Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                  <div className="flex gap-2 mt-3">
                    <div className="w-16 h-5 bg-gray-200 rounded"></div>
                    <div className="w-12 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="py-12 text-center">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {isGuest ? 'No public boards found' : showArchived ? 'No archived boards' : 'No boards found'}
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'Try adjusting your search to see more boards.'
              : isGuest
                ? 'There are no public boards available at the moment.'
                : showArchived 
                  ? 'You don\'t have any archived boards yet.'
                  : 'Get started by creating your first board.'}
          </p>
          {isAdmin && !isGuest && !showArchived && (
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Board
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageMembers={handleManageMembers}
              onViewDetails={handleViewDetails}
              onArchive={handleArchive}
              onNavigate={handleNavigate}
              isAdmin={!!isAdmin}
              isGuest={!!isGuest}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {boardsData?.pagination && boardsData.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {filters.page} of {boardsData.pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
            disabled={filters.page === boardsData.pagination.pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modals - Only show creation modal to admins */}
      {isAdmin && !isGuest && (
        <CreateBoardModal
          open={createModalOpen} 
          onClose={() => setCreateModalOpen(false)} 
        />
      )}
      
      {selectedBoard && (
        <>
          <BoardDetailModal
            board={selectedBoard}
            open={detailModalOpen}
            onClose={() => {
              setDetailModalOpen(false)
              setSelectedBoard(null)
            }}
            onEdit={() => {
              setDetailModalOpen(false)
              setEditModalOpen(true)
            }}
            onDelete={() => {
              setDetailModalOpen(false)
              handleDelete(selectedBoard.id)
              setSelectedBoard(null)
            }}
            onManageMembers={() => {
              setDetailModalOpen(false)
              setMembersModalOpen(true)
            }}
          />
          
          {/* Only show edit modal to non-guest users */}
          {!isGuest && (
            <EditBoardModal
              board={selectedBoard}
              open={editModalOpen}
              onClose={() => {
                setEditModalOpen(false)
                setSelectedBoard(null)
              }}
            />
          )}
          
          {/* Only show members modal to admins */}
          {isAdmin && !isGuest && (
            <BoardMembersModal
              board={selectedBoard}
              open={membersModalOpen}
              onClose={() => {
                setMembersModalOpen(false)
                setSelectedBoard(null)
              }}
            />
          )}
        </>
      )}
    </div>
  )
}