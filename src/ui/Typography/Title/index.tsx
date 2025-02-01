import React from 'react'
import { TitleProps } from '@/ui/Typography/Title/types'
import { cn } from '@/utils'

const fontSizeClasses: Record<number, string> = {
  1: `text-[length:--font-size-h1]`,
  2: `text-[length:--font-size-h2]`,
  3: `text-[length:--font-size-h3]`,
  4: `text-[length:--font-size-h4]`,
  5: `text-[length:--font-size-h5]`,
  6: `text-[length:--font-size-h6]`
}

const Title: React.FC<TitleProps> = ({ level, className, children }) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements
  const fontSizeClass = fontSizeClasses[level]

  return (
    <Tag className={cn([`title`, fontSizeClass, className])}>{children}</Tag>
  )
}

export default Title
