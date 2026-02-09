import React, { ReactNode } from 'react'
import { Calendar, Video, Link } from 'lucide-react'
import { cn } from '@/utils'

interface ICategoriesBadgeProps {
  category: 'video' | 'event' | 'link'
  className?: string
}

const CategoriesBadge = ({ category, className }: ICategoriesBadgeProps) => {
  const icons: Record<ICategoriesBadgeProps['category'], ReactNode> = {
    video: <Video size={16} />,
    event: <Calendar size={16} />,
    link: <Link size={16} />
  }

  return (
    <span
      className={cn([
        'inline-flex self-start items-center gap-1 rounded-full bg-secondary-light px-2.5 py-1 text-sm font-medium text-primary dark:bg-white/10 dark:text-neutral-50',
        className
      ])}
    >
      {icons[category]}

      {category && (
        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
      )}
    </span>
  )
}

export default CategoriesBadge
