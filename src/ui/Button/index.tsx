import React, { forwardRef } from 'react'
import { cn } from '@/utils'

import ClientRipple from './Ripple'
import { ButtonProps } from './types'
import { buttonSizesClass, variantClasses } from './constants'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'lg',
      className,
      onClick,
      disabled
    },
    ref
  ) => {
    const defaultClasses = variantClasses[variant]
    const defaultSize = buttonSizesClass[size]

    return (
      <button
        ref={ref}
        onClick={onClick}
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
      >
        {children}
        <ClientRipple />
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
