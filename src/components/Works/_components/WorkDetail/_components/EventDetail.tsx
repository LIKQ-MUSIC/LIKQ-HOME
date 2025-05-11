import React from 'react'
import { Paragraph } from '@/ui/Typography'
import { IWorkItem } from '@/components/Works/types'

const EventDetail = ({ description }: IWorkItem) => {
  return (
    <>
      <Paragraph className="line-clamp-4">{description}</Paragraph>
    </>
  )
}

export default EventDetail
