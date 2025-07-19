import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-gradient-to-r from-[#5048e5] via-[#271ed2] to-[#2019ae] text-white hover:opacity-90 focus:ring-[#6366f1] shadow-lg hover:shadow-xl',
      destructive: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444]',
      outline: 'border border-[#e1e7ef] bg-white text-[#030711] hover:bg-[#f1f5f9] focus:ring-[#6366f1]',
      secondary: 'bg-[#f1f5f9] text-[#030711] hover:bg-[#e2e8f0] focus:ring-[#64748b]',
      ghost: 'text-[#64748b] hover:bg-[#f1f5f9] focus:ring-[#64748b]',
      link: 'text-[#6366f1] underline-offset-4 hover:underline focus:ring-[#6366f1]'
    }

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-9 px-3 text-xs',
      lg: 'h-11 px-8 text-base',
      icon: 'h-10 w-10'
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }