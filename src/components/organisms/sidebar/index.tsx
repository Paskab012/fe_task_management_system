/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Trello,
  CheckSquare,
  Settings,
  Bell,
  FileText,
  Shield,
  ChevronLeft,
  Plus,
//   Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/auth-store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles?: string[]
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'admin', 'user'],
  },
  {
    title: 'My Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
    badge: 5,
    roles: ['super_admin', 'admin', 'user'],
  },
  {
    title: 'Boards',
    href: '/dashboard/boards',
    icon: Trello,
    roles: ['super_admin', 'admin', 'user'],
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    badge: 3,
    roles: ['super_admin', 'admin', 'user'],
  },
]

const adminItems: NavItem[] = [
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Board Management',
    href: '/admin/boards',
    icon: Trello,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: FileText,
    roles: ['super_admin'],
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: Shield,
    roles: ['super_admin'],
  },
]

const SidebarItem: React.FC<{
  item: NavItem
  collapsed: boolean
  userRole: string
}> = ({ item, collapsed, userRole }) => {
  const location = useLocation()
  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')

  // Check if user has permission to see this item
  if (item.roles && !item.roles.includes(userRole)) {
    return null
  }

  const content = (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground',
          collapsed && 'justify-center px-2'
        )
      }
    >
      <item.icon className={cn('h-4 w-4 shrink-0')} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="truncate"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && (
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
          {item.badge}
        </Badge>
      )}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
          {item.badge && (
            <Badge variant="secondary" className="h-4 px-1 ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuthStore()
  const userRole = user?.role || 'user'
  const isAdmin = ['super_admin', 'admin'].includes(userRole)

  return (
    <TooltipProvider>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex h-full flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary">
                  <span className="text-sm font-bold text-white">T</span>
                </div>
                <span className="text-lg font-semibold text-transparent bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text">
                  TaskFlow
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              'h-8 w-8 ml-auto hover:bg-accent',
              collapsed && 'mx-auto'
            )}
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Quick Actions */}
          <div className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-medium text-muted-foreground">
                Quick Actions
              </p>
            )}
            <Button
              variant="default"
              size={collapsed ? 'icon' : 'sm'}
              className={cn(
                'w-full gap-2 shadow-sm',
                collapsed && 'h-8 w-8 p-0'
              )}
            >
              <Plus className="w-4 h-4 shrink-0" />
              {!collapsed && <span>New Task</span>}
            </Button>
          </div>

          <Separator />

          {/* Main Navigation */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-medium text-muted-foreground">
                Main
              </p>
            )}
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                collapsed={collapsed}
                userRole={userRole}
              />
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                {!collapsed && (
                  <p className="px-3 mb-2 text-xs font-medium text-muted-foreground">
                    Administration
                  </p>
                )}
                {adminItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    collapsed={collapsed}
                    userRole={userRole}
                  />
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <SidebarItem
            item={{
              title: 'Settings',
              href: '/dashboard/settings',
              icon: Settings,
              roles: ['super_admin', 'admin', 'user'],
            }}
            collapsed={collapsed}
            userRole={userRole}
          />
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}