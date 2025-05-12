import { StaffCardProps } from '@/components/Team/_components/StaffCard/types'
import { Paragraph, Title } from '@/ui/Typography'

const StaffCard = ({ imageUrl, name, description }: StaffCardProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="w-52 h-52 rounded-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>

      <Title level={6}>{name}</Title>
      <Paragraph className="whitespace-pre">{description}</Paragraph>
    </div>
  )
}

export default StaffCard
