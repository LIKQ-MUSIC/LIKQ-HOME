import * as React from "react"

import { cn } from "@/utils/cn"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "block text-sm font-medium text-neutral-600 mb-2",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
