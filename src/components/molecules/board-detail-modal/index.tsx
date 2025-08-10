import * as React from 'react'
import { 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Eye,
  Archive,
  UserPlus,
  ExternalLink,
  Copy,
  Settings
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Board, BoardVisibility } from '@/types/board.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'
import { useBoardMembers } from '@/hooks/use-boards'

interface BoardDetailModalProps {
  board: Board
  open: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onManageMembers: () => void
}

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

const getVisibilityDescription = (visibility: BoardVisibility) => {
  switch (visibility) {
    case BoardVisibility.PUBLIC:
      return 'Anyone can view this board'
    case BoardVisibility.PRIVATE:
      return 'Only you and invited members can access'
    case BoardVisibility.ORGANIZATION:
      return 'Visible to your organization members'
    default:
      return ''
  }
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const BoardDetailModal: React.FC<BoardDetailModalProps> = ({
  board,
  open,
  onClose,
  onEdit,
  onDelete,
  onManageMembers,
}) => {
  const { user } = useAuthStore()
  const { data: membersData } = useBoardMembers(board.id)
  
  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
  const canEdit = isAdmin || board.createdById === user?.id
  const canDelete = isAdmin || board.createdById === user?.id

  const createdByAvatar = board.createdBy 
    ? generateAvatar(`${board.createdBy.firstName} ${board.createdBy.lastName}`)
    : null

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/dashboard/boards/${board.id}`
    await navigator.clipboard.writeText(url)
    // Could add toast notification here
  }

  const handleOpenBoard = () => {
    window.open(`/dashboard/boards/${board.id}`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center flex-1 min-w-0 gap-4">
              <div 
                className="flex items-center justify-center flex-shrink-0 w-16 h-16 text-2xl rounded-xl"
                style={{ backgroundColor: (board.color || '#3B82F6') + '20' }}
              >
                {board.icon || '📋'}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {board.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getVisibilityColor(board.visibility)} text-xs`}>
                    <span className="mr-1">{getVisibilityIcon(board.visibility)}</span>
                    {board.visibility}
                  </Badge>
                  {board.isArchived && (
                    <Badge variant="secondary" className="text-xs">
                      <Archive className="w-3 h-3 mr-1" />
                      Archived
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={handleOpenBoard}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
              {canEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {board.description && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap dark:text-gray-400">
                {board.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Board Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Visibility */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Visibility</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {board.visibility}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getVisibilityDescription(board.visibility)}
                </p>
              </div>
            </div>

            {/* Created By */}
            {board.createdBy && (
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={board.createdBy.avatar} />
                  <AvatarFallback className={`${createdByAvatar?.className} text-white text-xs`}>
                    {createdByAvatar?.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created by</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {board.createdBy.firstName} {board.createdBy.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {board.createdBy.email}
                  </p>
                </div>
              </div>
            )}

            {/* Organization */}
            {board.organization && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                  <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Organization</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {board.organization.name}
                 </p>
               </div>
             </div>
           )}

           {/* Task Count */}
           {board._count?.tasks !== undefined && (
             <div className="flex items-center gap-3">
               <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                 <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
               </div>
               <div>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Tasks</p>
                 <p className="text-sm font-medium text-gray-900 dark:text-white">
                   {board._count.tasks} total tasks
                 </p>
               </div>
             </div>
           )}
         </div>

         <Separator />

         {/* Members Section */}
         <div>
           <div className="flex items-center justify-between mb-4">
             <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
               <Users className="w-4 h-4" />
               Members {membersData?.response.length ? `(${membersData.response.length})` : ''}
             </h3>
             {isAdmin && (
               <Button variant="outline" size="sm" onClick={onManageMembers}>
                 <UserPlus className="w-4 h-4 mr-2" />
                 Manage
               </Button>
             )}
           </div>
           
           {membersData?.response.length ? (
             <div className="space-y-3">
               {membersData.response.slice(0, 5).map((member) => {
                 const memberAvatar = member.user 
                   ? generateAvatar(`${member.user.firstName} ${member.user.lastName}`)
                   : null

                 return (
                   <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                     <Avatar className="w-8 h-8">
                       <AvatarImage src={member.user?.avatar} />
                       <AvatarFallback className={`${memberAvatar?.className} text-white text-xs`}>
                         {memberAvatar?.initials}
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                       <p className="text-sm font-medium text-gray-900 dark:text-white">
                         {member.user?.firstName} {member.user?.lastName}
                       </p>
                       <p className="text-xs text-gray-600 dark:text-gray-400">
                         {member.user?.email}
                       </p>
                     </div>
                     <Badge variant="outline" className="text-xs capitalize">
                       {member.role}
                     </Badge>
                   </div>
                 )
               })}
               {membersData.response.length > 5 && (
                 <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                   +{membersData.response.length - 5} more members
                 </p>
               )}
             </div>
           ) : (
             <div className="py-6 text-center rounded-lg bg-gray-50 dark:bg-gray-800">
               <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
               <p className="text-sm text-gray-600 dark:text-gray-400">
                 No members added yet
               </p>
               {isAdmin && (
                 <Button variant="outline" size="sm" onClick={onManageMembers} className="mt-2">
                   Add Members
                 </Button>
               )}
             </div>
           )}
         </div>

         <Separator />

         {/* Quick Actions */}
         <div>
           <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
             Quick Actions
           </h3>
           <div className="flex flex-wrap gap-2">
             <Button variant="outline" size="sm" onClick={handleCopyLink}>
               <Copy className="w-4 h-4 mr-2" />
               Copy Link
             </Button>
             <Button variant="outline" size="sm" onClick={handleOpenBoard}>
               <ExternalLink className="w-4 h-4 mr-2" />
               Open Board
             </Button>
             {isAdmin && (
               <Button variant="outline" size="sm" onClick={onManageMembers}>
                 <UserPlus className="w-4 h-4 mr-2" />
                 Manage Members
               </Button>
             )}
           </div>
         </div>

         {/* Timestamps */}
         <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
           <p>Created: {formatDateTime(board.createdAt)}</p>
           <p>Updated: {formatDateTime(board.updatedAt)}</p>
         </div>
       </div>
     </DialogContent>
   </Dialog>
 )
}