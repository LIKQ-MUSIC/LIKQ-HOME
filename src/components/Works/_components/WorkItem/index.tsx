import Image from 'next/image'
import { Category } from '@/components/Works/types'
import CategoriesBadge from '@/components/Works/_components/CategoriesBadge'
import { cn } from '@/utils/cn'

interface WorkItemProps {
  imageUrl: string
  name: string
  category: Category
  onClick: () => void
  className?: string
}

const WorkItem = ({
  imageUrl,
  name,
  category,
  onClick,
  className
}: WorkItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100',
        className
      )}
    >
      {/* Label */}
      <CategoriesBadge
        className="absolute top-2 left-2 z-10"
        category={category}
      />

      {/* 16:9 Image Container */}
      <div className="aspect-[16/9] w-full overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-primary line-clamp-2 min-h-[3.5rem] group-hover:text-secondary transition-colors">
          {name}
        </h3>
      </div>
    </div>
  )
}

export default WorkItem
