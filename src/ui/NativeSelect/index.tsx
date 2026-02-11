import * as React from "react"

import { cn } from "@/utils/cn"

const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "select-base w-full",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
