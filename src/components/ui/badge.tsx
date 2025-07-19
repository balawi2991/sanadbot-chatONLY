import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-[#eef2ff] text-[#6366f1] border-[#c7d2fe]',
      secondary: 'bg-[#f1f5f9] text-[#64748b] border-[#e1e7ef]',
      destructive: 'bg-[#fef2f2] text-[#ef4444] border-[#fecaca]',
      success: 'bg-[#f0fdf4] text-[#10b981] border-[#bbf7d0]',
      warning: 'bg-[#fffbeb] text-[#f59e0b] border-[#fed7aa]',
      outline: 'text-[#64748b] border-[#e1e7ef] bg-transparent'
    }

    const sizes = {
      default: 'px-2.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-medium',
          'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }