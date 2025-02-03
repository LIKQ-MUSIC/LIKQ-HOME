import React from 'react'
import { CardProps } from '@/components/Card/types'
import { Title, Paragraph } from '@/ui/Typography'
import RenderedDefaultString from '@/ui/RenderDefaultString'

const Card = ({ title, icon, description }: CardProps) => {
  return (
    <div
      className="max-w-[368px] bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
      data-testid="card"
    >
      {/* Gradient Header */}
      <div className="h-40 bg-gradient-to-b from-secondary via-[#6C708C] to-primary rounded-t-2xl relative">
        <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-32 h-32 rounded-full bg-white shadow-md">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 px-6 py-11 text-center">
        <RenderedDefaultString element={title}>
          <Title level={5}>{title}</Title>
        </RenderedDefaultString>

        <RenderedDefaultString element={description}>
          <Paragraph className="mt-2">{description}</Paragraph>
        </RenderedDefaultString>
      </div>
    </div>
  )
}

export default Card
