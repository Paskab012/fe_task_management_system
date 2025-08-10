import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              variant === 'destructive' 
                ? 'bg-red-100 dark:bg-red-900/20' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                variant === 'destructive' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}