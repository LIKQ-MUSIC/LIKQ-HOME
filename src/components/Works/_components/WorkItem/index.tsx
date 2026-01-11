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

const WorkItem = ({ imageUrl, name, category, onClick, className }: WorkItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 dark:bg-slate-800",
        className
      )}
    >
      {/* Label */}
      <CategoriesBadge className="absolute top-2 left-2 z-10" category={category} />

      {/* 16:9 Image Container */}
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-primary dark:text-white line-clamp-2 group-hover:text-secondary transition-colors">
            {name}
        </h3>
      </div>
    </div>
  )
}

export default WorkItem
