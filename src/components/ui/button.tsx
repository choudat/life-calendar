import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm hover:shadow-md': variant === 'default',
            'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md': variant === 'outline',
            'hover:bg-slate-50 text-slate-600': variant === 'ghost',
            'bg-rose-50 text-rose-600 hover:bg-rose-100': variant === 'danger',
            'h-10 px-4 py-2': size === 'default',
            'h-8 px-3 text-xs': size === 'sm',
            'h-12 px-8': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
