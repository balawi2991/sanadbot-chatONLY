import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
  text?: string
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  variant = 'spinner', 
  className, 
  text 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const renderSpinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizes[size],
        className
      )}
    />
  )

  const renderDots = () => (
    <div className={cn('flex space-x-1', className)}>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )

  const renderPulse = () => (
    <div
      className={cn(
        'bg-blue-600 rounded-full animate-pulse',
        sizes[size],
        className
      )}
    />
  )

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderVariant()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// مكون Loading للصفحة الكاملة
interface PageLoadingProps {
  text?: string
}

const PageLoading: React.FC<PageLoadingProps> = ({ text = 'جاري التحميل...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loading size="xl" text={text} />
      </div>
    </div>
  )
}

// مكون Loading للمحتوى
interface ContentLoadingProps {
  text?: string
  className?: string
}

const ContentLoading: React.FC<ContentLoadingProps> = ({ 
  text = 'جاري التحميل...', 
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Loading size="lg" text={text} />
    </div>
  )
}

export { Loading, PageLoading, ContentLoading }