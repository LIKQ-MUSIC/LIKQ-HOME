import { Category } from '@/components/Works/types'
import CategoriesBadge from '@/components/Works/_components/CategoriesBadge'

interface WorkItemProps {
  imageUrl: string
  name: string
  category: Category
  onClick: () => void
}

const WorkItem = ({ imageUrl, name, category, onClick }: WorkItemProps) => {
  return (
    <div
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-xl cursor-pointer"
    >
      {/* Label */}
      <CategoriesBadge className="absolute top-1 left-1" category={category} />

      {/* 16:9 Image Container */}
      <div className="aspect-[16/9] w-full">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    </div>
  )
}

export default WorkItem
