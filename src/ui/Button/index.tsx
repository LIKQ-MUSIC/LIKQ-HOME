import React from 'react'
import { cn } from '@/utils'

import ClientRipple from './Ripple'
import { ButtonProps } from './types'
import { buttonSizesClass, variantClasses } from './constants'

const Button = ({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  onClick,
  disabled
}: ButtonProps) => {
  const defaultClasses = variantClasses[variant]
  const defaultSize = buttonSizesClass[size]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn([
        `relative overflow-hidden font-medium
        transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95`,
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

export default Button
