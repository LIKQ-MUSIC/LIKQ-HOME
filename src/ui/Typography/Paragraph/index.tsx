import React from 'react'
import { ParagraphProps } from '@/ui/Typography/Paragraph/types'

const Paragraph = ({ className, children }: ParagraphProps) => (
  <p className={className}>{children}</p>
)

export default Paragraph
