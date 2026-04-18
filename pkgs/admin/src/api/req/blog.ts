import type { ListReq } from '@/api/req/req'

export interface PostListReq extends ListReq {
  keyword?: string
  category_id?: number
  status?: number
}

export interface PostCreateReq {
  category_id: number
  status: number
  slug: string
  title: string
  summary: string
  content: string
}

export interface PostUpdateReq {
  category_id: number
  status: number
  slug: string
  title: string
  summary: string
  content: string
}
