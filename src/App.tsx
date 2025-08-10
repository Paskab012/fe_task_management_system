import * as React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { AnimatePresence } from 'framer-motion'


// Layouts

// Pages
// import { Tasks } from '@/pages/dashboard/Tasks'
// import { Boards } from '@/pages/dashboard/Boards'
// import { Profile } from '@/pages/dashboard/Profile'
// import { AdminDashboard } from '@/pages/admin/AdminDashboard'
// import { UserManagement } from '@/pages/admin/UserManagement'
// import { BoardManagement } from '@/pages/admin/BoardManagement'
// import { NotFound } from '@/pages/NotFound'

// Components

// Utils
import { initializeTheme } from '@/stores/theme-store'
import { AuthLayout } from './components/layouts/auth'
import { Login } from './pages/auth/login'
import { Register } from './pages/auth/register'
import { ProtectedRoute } from './components/molecules/protected-route'
import { DashboardLayout } from './components/layouts/dashboard'
import { Dashboard } from './pages/dashboard/dashboard'
import { Tasks } from './pages/dashboard/task'
import { Boards } from './pages/dashboard/boards'
import { Profile } from './pages/dashboard/profile'
import { NotFound } from './pages/not-found'

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  React.useEffect(() => {
    initializeTheme()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen font-sans antialiased bg-background">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout/>}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register/>} />
                <Route index element={<Navigate to="login" replace />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="boards" element={<Boards/>} />
                <Route path="profile" element={<Profile/>} />
              </Route>

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                // element={
                //   <AdminRoute>
                //     <AdminLayout />
                //   </AdminRoute>
                // }
              >
                {/* <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="boards" element={<BoardManagement />} /> */}
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>

          {/* Global Notifications */}
          <Toaster
            position="top-right"
            expand={true}
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </div>
      </Router>

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App