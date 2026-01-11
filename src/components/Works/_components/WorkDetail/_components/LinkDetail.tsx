import React from 'react'
import { Paragraph } from '@/ui/Typography'
import { IWorkItem, LinkWorkItem } from '@/components/Works/types'
import Link from 'next/link'
import { createGoogleCalendarLink } from '@/utils'
import Button from '@/ui/Button'
import { CalendarPlus } from 'lucide-react'

const LinkDetail = ({ description, url }: LinkWorkItem) => {
  return (
    <>
      <Paragraph className="line-clamp-4 text-primary-light">{description}</Paragraph>

      <div className="w-full flex items-center gap-2">
        <Link href={url} target="_blank">
          <Button size="md">รายละเอียด</Button>
        </Link>
      </div>
    </>
  )
}

export default LinkDetail
