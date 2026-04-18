export interface PostOptionItemResp {
  id: number
  label: string
}

export interface PostListItemResp {
  id: number
  category_id: number
  title: string
  slug: string
  status: number
  created_at: string
}

export interface PostInfoResp {
  id: number
  category_id: number
  title: string
  slug: string
  summary: string
  content: string
  status: number
  created_at: string
}
