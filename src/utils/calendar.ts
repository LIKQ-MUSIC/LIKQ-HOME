import dayjs from '@/utils/dayjs'

/**
 * Create a Google Calendar event URL
 * @param title - Event title
 * @param start - dayjs object (local time)
 * @param end - dayjs object (local time)
 * @param options - Optional event details
 */
export const createGoogleCalendarLink = (
  title: string,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  options?: {
    description?: string
    location?: string
  }
): string => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'

  const formatDate = (d: dayjs.Dayjs) => d.utc().format('YYYYMMDDTHHmmss[Z]')

  const params = new URLSearchParams({
    text: title,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: options?.description || '',
    location: options?.location || '',
    sf: 'true',
    output: 'xml'
  })

  return `${baseUrl}&${params.toString()}`
}
