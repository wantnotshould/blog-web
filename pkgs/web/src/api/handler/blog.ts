import request from '@/utIls/request'
import type { BlogDetailReq } from '../req/blog'
import type { ListReq } from '../req/req'
import type { BlogDetailResp, BlogListItemResp } from '../resp/blog'
import type { CommonResp, PageContent } from '../resp/resp'

export const blogList = (param: ListReq) => {
  return request.get<CommonResp<PageContent<BlogListItemResp>>>('/api/v1/site/posts', {
    params: param,
  })
}

export const blogDetail = (param: BlogDetailReq) => {
  return request.get<CommonResp<BlogDetailResp>>(`/api/v1/site/posts/${param.slug}`)
}
