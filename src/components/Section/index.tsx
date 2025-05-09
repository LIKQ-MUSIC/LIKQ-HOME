import React from 'react'
import { ISectionProps } from '@/components/Section/types'
import { Title } from '@/ui/Typography'

const Section = ({ title, children }: ISectionProps) => {
  return (
    <section className="h-[100dvh] flex flex-col items-center justify-start p-20">
      <Title level={2}>{title}</Title>

      {children}
    </section>
  )
}

export default Section
