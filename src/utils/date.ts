import dayjs from '@/utils/dayjs'

const FALLBACK_DATE = '-'

export const formatDateShort = (dateString?: string, fallback = FALLBACK_DATE) => {
  if (!dateString) return fallback
  const date = dayjs.utc(dateString)
  if (!date.isValid()) return dateString
  return date.format('DD-MM-YYYY')
}

export const formatDateTimeShort = (
  dateString?: string,
  fallback = FALLBACK_DATE
) => {
  if (!dateString) return fallback
  const date = dayjs.utc(dateString)
  if (!date.isValid()) return dateString
  return date.format('DD-MM-YYYY HH:mm')
}

export const formatDateThaiBuddhist = (
  dateString?: string,
  fallback = FALLBACK_DATE
) => {
  if (!dateString) return fallback
  const date = dayjs.utc(dateString)
  if (!date.isValid()) return dateString
  const buddhistYear = date.year() + 543
  return `${date.format('DD-MM-')}${buddhistYear}`
}

export const formatDateThaiLong = (
  dateString?: string,
  fallback = FALLBACK_DATE
) => {
  if (!dateString) return fallback
  const date = dayjs.utc(dateString)
  if (!date.isValid()) return dateString
  return date.format('DD-MM-YYYY')
}
