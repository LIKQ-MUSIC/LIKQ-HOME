import { Title } from '@/ui/Typography'
import { TitleProps } from '@/ui/Typography/Title/types'

const levels: TitleProps['level'][] = [1, 2, 3, 4, 5]

export default function Core({ children }) {
  return (
    <>
      {levels.map(item => (
        <Title level={item} key={item}>
          {`Heading ${item}`}
        </Title>
      ))}
    </>
  )
}
