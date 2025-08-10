import * as React from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6 text-center"
      >
        <Card className="p-8 bg-white border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-0 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold text-blue-500"
            >
              404
            </motion.div>
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline" 
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="gap-2 text-white bg-blue-500 hover:bg-blue-600"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}