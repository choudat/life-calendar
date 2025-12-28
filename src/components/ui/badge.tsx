import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
  colorClass?: string
}

function Badge({ className, variant = 'default', colorClass, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === 'default' && "border-transparent bg-slate-900 text-white hover:bg-slate-800",
        variant === 'outline' && "text-slate-900",
        colorClass, // Allow overriding colors directly
        className
      )}
      {...props}
    />
  )
}

export { Badge }
