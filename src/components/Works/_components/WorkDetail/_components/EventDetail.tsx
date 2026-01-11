import React from 'react'
import { Paragraph } from '@/ui/Typography'
import { EventWorkItem } from '@/components/Works/types'
import Button from '@/ui/Button'
import Link from 'next/link'
import { createGoogleCalendarLink } from '@/utils'
import { CalendarPlus } from 'lucide-react'

const EventDetail = ({
  title,
  start,
  end,
  location,
  description,
  url
}: EventWorkItem) => {
  return (
    <>
      <Paragraph className="line-clamp-4 text-primary-light">{description}</Paragraph>

      <div className="w-full flex items-center gap-2">
        <Link
          href={createGoogleCalendarLink(title, start, end, {
            description: description,
            location
          })}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button
            className="inline-flex justify-center items-center gap-1 text-nowrap"
            variant="outline"
            size="md"
          >
            <CalendarPlus size={20} /> เพิ่มลงในปฏิทิน
          </Button>
        </Link>

        <Link href={url || '/'} target="_blank">
          <Button size="md">รายละเอียด</Button>
        </Link>
      </div>
    </>
  )
}

export default EventDetail
