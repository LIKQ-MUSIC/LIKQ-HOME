import React, { forwardRef } from 'react'
import { cn } from '@/utils'

import ClientRipple from './Ripple'
import { ButtonProps } from './types'
import { buttonSizesClass, variantClasses } from './constants'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'lg',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const defaultClasses = variantClasses[variant]
    const defaultSize = buttonSizesClass[size]

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn([
          `relative overflow-hidden font-medium
          transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95 flex items-center justify-center whitespace-nowrap`,
          defaultSize,
          defaultClasses,
          className,
          disabled &&
            'bg-disabled text-disabled-text cursor-not-allowed hover:bg-disabled'
        ])}
        {...props}
      >
        {children}
        <ClientRipple />
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
