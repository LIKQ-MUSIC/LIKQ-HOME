import React from 'react'
import { ISectionProps } from '@/components/Section/types'
import { Title } from '@/ui/Typography'

import { cn } from '@/utils'

const Section = ({ id, title, children, className }: ISectionProps) => {
  return (
    <section
      id={id}
      className={cn([
        'min-h-fit py-16 md:py-24 flex flex-col items-center justify-start px-4 md:px-8',
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
