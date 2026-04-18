export const timeFormatFromISO = (value?: string | null, empty = ''): string => {
  if (!value) return empty

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return empty

  if (date.getTime() === 0) return empty

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(/\//g, '-')
}
