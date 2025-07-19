import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, iconPosition = 'right', type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#030711] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-[#64748b]">
                {icon}
              </div>
            </div>
          )}
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-[#64748b]">
                {icon}
              </div>
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-[10px] border border-[#e1e7ef] bg-white px-3 py-2',
              'text-sm text-[#030711] placeholder:text-[#64748b]',
              'focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200 hover:border-[#6366f1]',
              icon && iconPosition === 'right' && 'pr-10',
              icon && iconPosition === 'left' && 'pl-10',
              error && 'border-[#ef4444] focus:ring-[#ef4444]',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }