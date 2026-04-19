export interface CommonResp<T = any> {
  code: number
  status: boolean
  message: string
  data: T
}

export interface PageContent<T = any> {
  content: T[]
  count: number
}
