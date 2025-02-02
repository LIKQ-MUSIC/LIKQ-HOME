import { ButtonSize, ButtonVariant } from './types'

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-active',
  ghost:
    'bg-transparent text-primary hover:shadow-none active:bg-primary-light',
  danger: 'bg-danger text-white hover:bg-danger-hover active:bg-danger-active',
  warning:
    'bg-warning text-white hover:bg-warning-hover active:bg-warning-active',
  success:
    'bg-success text-white hover:bg-success-hover active:bg-success-active',
  outline: 'border border-primary text-primary hover:bg-primary-light'
}

export const buttonSizesClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-sm rounded-[20px]',
  md: 'h-9 px-4 text-base rounded-[24px]',
  lg: 'h-12 px-6 text-lg rounded-[28px]'
}
