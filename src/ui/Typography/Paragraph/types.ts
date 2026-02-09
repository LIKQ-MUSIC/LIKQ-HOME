import React from 'react'

export type ParagraphVariant = 'default' | 'label'

export interface ParagraphProps {
  variant?: ParagraphVariant
  className?: string
  children: React.ReactNode
}
