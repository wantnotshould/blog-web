const PREFIX = 'cdme'

export const withPrefix = (key: string): string => {
  return `${PREFIX}:${key}`
}
