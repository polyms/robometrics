import { Duration, format, parse } from 'date-fns'

const FORMAT_PARSE = 'yyyyMMdd HH:mm:ss.SSS'
const FORMAT_DATE = 'yyyy-MM-dd HH:mm:ss.SSS'

export const parseDate = (str: string | null | undefined): Date | null =>
  !str ? null : parse(str, FORMAT_PARSE, new Date())

export const formatDate = (val: Date | string) => {
  if (typeof val === 'undefined') return null
  if (!val) return null
  return format(new Date(val), FORMAT_DATE)
}

export const formatDateFrom = (str: string): string =>
  format(parseDate(str) as Date, FORMAT_DATE)

export const formatDuration = (dur: Duration): string => {
  const hours = (dur.hours || 0) < 10 ? `0${dur.hours || 0}` : dur.hours
  const minutes = (dur.minutes || 0) < 10 ? `0${dur.minutes || 0}` : dur.minutes
  const seconds = (dur.seconds || 0) < 10 ? `0${dur.seconds || 0}` : dur.seconds
  return [hours, minutes, seconds].join(':')
}
