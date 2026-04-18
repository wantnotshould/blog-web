import type { StorageType } from './types'

export const getNativeStorage = (type: StorageType): Storage => {
  return type === 'session' ? sessionStorage : localStorage
}
