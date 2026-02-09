import React from 'react'
import { ParagraphProps, ParagraphVariant } from '@/ui/Typography/Paragraph/types'
import { cn } from '@/utils'

const variantClasses: Record<ParagraphVariant, string> = {
  default: '',
  label: 'text-sm tracking-[0.3em] uppercase text-gray-400'
}

const Paragraph = ({ variant = 'default', className, children }: ParagraphProps) => (
  <p className={cn([variantClasses[variant], className])}>{children}</p>
)

export default Paragraph
