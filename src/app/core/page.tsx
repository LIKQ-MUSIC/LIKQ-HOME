import { Title } from '@/ui/Typography'
import { TitleProps } from '@/ui/Typography/Title/types'
import Button from '@/ui/Button'
import { buttonSizesClass, variantClasses } from '@/ui/Button/constants'
import { ButtonSize, ButtonVariant } from '@/ui/Button/types'

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
    </>
  )
}
