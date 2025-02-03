import { Title } from '@/ui/Typography'
import { TitleProps } from '@/ui/Typography/Title/types'
import Button from '@/ui/Button'
import { buttonSizesClass, variantClasses } from '@/ui/Button/constants'
import { ButtonSize, ButtonVariant } from '@/ui/Button/types'
import Microphone from '@/ui/Icons/Microphone'
import Card from '../../Components/Card'

const levels: TitleProps['level'][] = [1, 2, 3, 4, 5]

export default function Core() {
  return (
    <>
      {levels.map(item => (
        <Title level={item} key={item}>
          {`Heading ${item}`}
        </Title>
      ))}

      {Object.keys(variantClasses).map(variant => (
        <Button key={variant} variant={variant as ButtonVariant}>
          {variant}
        </Button>
      ))}

      {Object.keys(buttonSizesClass).map(size => (
        <Button key={size} size={size as ButtonSize}>
          {size}
        </Button>
      ))}

      <Title className="mt-2" level={3}>
        Icons
      </Title>

      <div className="flex gap-4">
        <Microphone className="w-8 h-8" />
        <Microphone className="text-primary" />
        <Microphone className="text-red-500" />
      </div>

      <Title className="mt-2" level={3}>
        Card
      </Title>

      <div className="grid grid-cols-3 w-full md:w-3/4 gap-2">
        <Card
          title="Music Production"
          description="Prod. / Songwriting Arranging"
          icon={<Microphone className="text-primary" />}
        />

        <Card
          title="Music Production"
          description="Prod. / Songwriting Arranging"
          icon={<Microphone className="text-primary" />}
        />

        <Card
          title="Music Production"
          description="Prod. / Songwriting Arranging"
          icon={<Microphone className="text-primary" />}
        />

        <Card
          title={<h1 data-testid="custom-title">Custom Title</h1>}
          description={
            <p data-testid="custom-description">Custom Description</p>
          }
          icon={<Microphone />}
        />
      </div>
    </>
  )
}
