import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100",
        className
      )}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear'
      }}
      {...props}
    />
  )
}

export { Skeleton }

// Skeleton components for different UI elements
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[12px] border border-[#e1e7ef]/50 p-6 space-y-4 bg-white/50 backdrop-blur-sm", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-[#6366f1]/20 via-[#8b5cf6]/20 to-[#06b6d4]/20" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-[200px] rounded-full" />
          <Skeleton className="h-3 w-[160px] rounded-full" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-4/5 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
      </div>
    </div>
  )
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[12px] border border-[#e1e7ef]/50 p-6 bg-white/50 backdrop-blur-sm", className)}>
      <div className="flex items-center">
        <Skeleton className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-[#6366f1]/20 via-[#8b5cf6]/20 to-[#06b6d4]/20" />
        <div className="mr-4 space-y-3">
          <Skeleton className="h-3 w-[80px] rounded-full" />
          <Skeleton className="h-6 w-[60px] rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function HeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[24px] border border-[#e1e7ef]/50 p-8 bg-gradient-to-br from-white/80 via-white/60 to-white/80 backdrop-blur-sm", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-[#6366f1]/30 via-[#8b5cf6]/30 to-[#06b6d4]/30" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-[300px] rounded-full" />
          <Skeleton className="h-5 w-[400px] rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-4 p-4 border-b border-[#e1e7ef]/50", className)}>
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-8 w-[80px] rounded-[6px]" />
    </div>
  )
}

export function FormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full rounded-[8px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-24 w-full rounded-[8px]" />
      </div>
      <Skeleton className="h-10 w-full rounded-[8px]" />
    </div>
  )
}