import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUIStore } from '@/stores/ui-store'
// import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/organisms/sidebar'
import { Header } from '@/components/organisms/header'

export const DashboardLayout = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header/>

        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container px-6 py-8 mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
