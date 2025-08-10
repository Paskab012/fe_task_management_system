import { Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/molecules/search-bar'
import { UserAvatar } from '@/components/molecules/user-avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/molecules/theme-toggle'

interface HeaderProps {
  title?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
}

export const Header = ({ title, showSearch = true, onSearch }: HeaderProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
          {showSearch && (
            <SearchBar 
              placeholder="Search tasks, boards..."
              onSearch={onSearch}
              className="max-w-sm w-96"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Add Button */}
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="w-4 h-4" />
            </Button>
            <Badge 
              variant="destructive" 
              className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs -top-1 -right-1"
            >
              3
            </Badge>
          </div>

          <ThemeToggle />

          <UserAvatar />
        </div>
      </div>
    </motion.header>
  )
}