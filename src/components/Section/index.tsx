import React from 'react'
import { ISectionProps } from '@/components/Section/types'
import { Title } from '@/ui/Typography'

import { cn } from '@/utils'

const Section = ({ id, title, children, className }: ISectionProps) => {
  return (
    <section
      id={id}
      className={cn([
        'min-h-[100dvh] flex flex-col items-center justify-start p-8 md:p-20',
        className
      ])}
    >
      {title && (
        <Title className="text-center" level={2}>
          {title}
        </Title>
      )}

      {children}
    </section>
  )
}

export default Section
