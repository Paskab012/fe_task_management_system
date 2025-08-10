/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
// //import { motion } from 'framer-motion'
import { UserPlus, Search, Crown, User, Eye, Trash2, Settings } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Avatar, AvatarFallback, AvatarImage ,
  Button,
  Input,
Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { 
  useBoardMembers, 
  useAddBoardMember, 
  useRemoveBoardMember, 
  useUpdateMemberRole, 
} from '@/hooks/use-boards'
import { Board, BoardMemberRole } from '@/types/board.types'
import { useAuthStore } from '@/stores/auth-store'
import { generateAvatar } from '@/lib/utils'
import { useUsers } from '@/hooks/use-users'

interface BoardMembersModalProps {
  board: Board
  open: boolean
  onClose: () => void
}

const roleOptions = [
  { 
    value: BoardMemberRole.ADMIN, 
    label: 'Admin', 
    description: 'Can manage board and members',
    icon: Crown,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
  },
  { 
    value: BoardMemberRole.MEMBER, 
    label: 'Member', 
    description: 'Can create and edit tasks',
    icon: User,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  },
  { 
    value: BoardMemberRole.VIEWER, 
    label: 'Viewer', 
    description: 'Can only view tasks',
    icon: Eye,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  },
]

export const BoardMembersModal: React.FC<BoardMembersModalProps> = ({ board, open, onClose }) => {
  const { user } = useAuthStore()
  const { data: membersData, isLoading: membersLoading } = useBoardMembers(board.id)
  const { data: usersData, isLoading: usersLoading } = useUsers()
  const addMemberMutation = useAddBoardMember()
  const removeMemberMutation = useRemoveBoardMember()
  const updateRoleMutation = useUpdateMemberRole()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedUserId, setSelectedUserId] = React.useState<string>('')
  const [selectedRole, setSelectedRole] = React.useState<BoardMemberRole>(BoardMemberRole.MEMBER)
  const [showAddMember, setShowAddMember] = React.useState(false)

  const isAdmin = user && ['super_admin', 'admin'].includes(user.role)
//   const isBoardOwner = board.createdById === user?.id

  // Filter available users (exclude current members)
  const availableUsers = React.useMemo(() => {
    if (!usersData?.response || !membersData?.response) return []
    
    const memberUserIds = membersData.response.map(member => member.userId)
    return usersData.response.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      const email = user.email.toLowerCase()
      const query = searchQuery.toLowerCase()
      
      return !memberUserIds.includes(user.id) && 
             (fullName.includes(query) || email.includes(query))
    })
  }, [usersData?.response, membersData?.response, searchQuery])

  React.useEffect(() => {
    if (open) {
      setSearchQuery('')
      setSelectedUserId('')
      setSelectedRole(BoardMemberRole.MEMBER)
      setShowAddMember(false)
    }
  }, [open])

  const handleAddMember = async () => {
    if (!selectedUserId || !isAdmin) return

    try {
      await addMemberMutation.mutateAsync({ 
        boardId: board.id, 
        userId: selectedUserId,
        role: selectedRole
      })
      setSelectedUserId('')
      setSearchQuery('')
      setShowAddMember(false)
    } catch (error) {
      console.error('Failed to add member:', error)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!isAdmin) return

    if (window.confirm('Are you sure you want to remove this member from the board?')) {
      try {
        await removeMemberMutation.mutateAsync({ 
          boardId: board.id, 
          userId 
        })
      } catch (error) {
        console.error('Failed to remove member:', error)
      }
    }
  }

  const handleUpdateRole = async (userId: string, role: BoardMemberRole) => {
    if (!isAdmin) return

    try {
      await updateRoleMutation.mutateAsync({ 
        boardId: board.id, 
        userId,
        role
      })
    } catch (error) {
      console.error('Failed to update member role:', error)
    }
  }

  const getRoleColor = (role: BoardMemberRole) => {
    return roleOptions.find(r => r.value === role)?.color || 'bg-gray-100 text-gray-800'
  }

  if (!isAdmin) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            Manage Board Members
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage who has access to "{board.name}"
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Member Section */}
          {!showAddMember ? (
            <Button 
              onClick={() => setShowAddMember(true)}
              className="w-full gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          ) : (
            <div className="p-4 space-y-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Add New Member</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddMember(false)}
                >
                  Cancel
                </Button>
              </div>

              {/* Search Users */}
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as BoardMemberRole)}>                
                <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => {
                      const IconComponent = role.icon
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs text-gray-600">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Available Users */}
              {usersLoading ? (
                <p className="py-4 text-sm text-center text-gray-500">Loading users...</p>
              ) : availableUsers.length === 0 ? (
                <p className="py-4 text-sm text-center text-gray-500">
                  {searchQuery ? 'No users found.' : 'All users are already members.'}
                </p>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-48">
                  {availableUsers.map((user) => {
                    const userAvatar = generateAvatar(`${user.firstName} ${user.lastName}`)
                    const isSelected = selectedUserId === user.id

                    return (
                      <div
                        key={user.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className={`${userAvatar.className} text-white text-xs`}>
                              {userAvatar.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <Button 
                onClick={handleAddMember}
                disabled={!selectedUserId}
                loading={addMemberMutation.isPending}
                className="w-full"
              >
                Add Member
              </Button>
            </div>
          )}

          {/* Current Members */}
          <div>
            <h3 className="mb-4 font-medium">
              Current Members {membersData?.response.length ? `(${membersData.response.length})` : ''}
            </h3>

            {membersLoading ? (
              <p className="py-4 text-center text-gray-500">Loading members...</p>
            ) : !membersData?.response.length ? (
              <p className="py-8 text-center text-gray-500">No members yet</p>
            ) : (
              <div className="space-y-3">
                {membersData.response.map((member) => {
                  const memberAvatar = member.user 
                    ? generateAvatar(`${member.user.firstName} ${member.user.lastName}`)
                    : null
                  const isOwner = member.userId === board.createdById
                  const isCurrentUser = member.userId === user?.id

                  return (
                    <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.user?.avatar} />
                        <AvatarFallback className={`${memberAvatar?.className} text-white text-sm`}>
                          {memberAvatar?.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {member.user?.firstName} {member.user?.lastName}
                          </p>
                          {isOwner && (
                            <Badge variant="secondary" className="text-xs">
                              Owner
                            </Badge>
                          )}
                          {isCurrentUser && (
                           <Badge variant="outline" className="text-xs">
                             You
                           </Badge>
                         )}
                       </div>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         {member.user?.email}
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">
                         Joined {new Date(member.joinedAt).toLocaleDateString()}
                       </p>
                     </div>

                     <div className="flex items-center gap-2">
                       {/* Role Badge/Selector */}
                       {isOwner ? (
                         <Badge className="text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">
                           <Crown className="w-3 h-3 mr-1" />
                           Owner
                         </Badge>
                       ) : (
                         <Select
                           value={member.role}
                           onValueChange={(role: string) => handleUpdateRole(member.userId, role as BoardMemberRole)}
                           disabled={updateRoleMutation.isPending}
                         >
                           <SelectTrigger className="w-32 h-8">
                             <Badge className={`${getRoleColor(member.role)} text-xs border-0`}>
                               {member.role}
                             </Badge>
                           </SelectTrigger>
                           <SelectContent>
                             {roleOptions.map((role) => (
                               <SelectItem key={role.value} value={role.value}>
                                 <Badge className={`${role.color} text-xs`}>
                                   {role.label}
                                 </Badge>
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       )}

                       {/* Remove Button */}
                       {!isOwner && !isCurrentUser && (
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => handleRemoveMember(member.userId)}
                           loading={removeMemberMutation.isPending}
                           className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       )}
                     </div>
                   </div>
                 )
               })}
             </div>
           )}
         </div>

         {/* Role Explanations */}
         <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
           <h4 className="flex items-center gap-2 mb-3 font-medium">
             <Settings className="w-4 h-4" />
             Role Permissions
           </h4>
           <div className="space-y-2 text-sm">
             {roleOptions.map((role) => {
               const IconComponent = role.icon
               return (
                 <div key={role.value} className="flex items-center gap-3">
                   <Badge className={`${role.color} text-xs`}>
                     <IconComponent className="w-3 h-3 mr-1" />
                     {role.label}
                   </Badge>
                   <span className="text-gray-600 dark:text-gray-400">
                     {role.description}
                   </span>
                 </div>
               )
             })}
           </div>
         </div>

         {/* Close Button */}
         <div className="flex justify-end pt-4">
           <Button onClick={onClose} className="px-6">
             Done
           </Button>
         </div>
       </div>
     </DialogContent>
   </Dialog>
 )
}