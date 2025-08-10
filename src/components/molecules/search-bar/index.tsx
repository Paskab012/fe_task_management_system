import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onClear?: () => void
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  className,
  value,
  onChange,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value || '')

  const searchValue = value !== undefined ? value : localValue
  const handleChange = onChange || setLocalValue

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchValue)
  }

  const handleClear = () => {
    handleChange('')
    onClear?.()
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </form>
  )
}