import { StaffCardProps } from '@/components/Team/_components/StaffCard/types'
import Image from 'next/image'
import { Paragraph, Title } from '@/ui/Typography'

const StaffCard = ({ imageUrl, name, description }: StaffCardProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="relative w-52 h-52 rounded-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <Title level={6}>{name}</Title>
      <Paragraph className="whitespace-pre">{description}</Paragraph>
    </div>
  )
}

export default StaffCard
