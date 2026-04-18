import request from '@/utils/request'
import type { PostCreateReq, PostListReq, PostUpdateReq } from '../req/blog'
import type { DeleteReq, InfoReq } from '../req/req'
import type { PostInfoResp, PostListItemResp, PostOptionItemResp } from '../resp/blog'
import type { CommonResp, PageContent } from '../resp/resp'

export const postCategory = () => {
  return request.get<CommonResp<PostOptionItemResp[]>>('/api/v1/admin/posts/categories')
}

export const postStatus = () => {
  return request.get<CommonResp<PostOptionItemResp[]>>('/api/v1/admin/posts/statuses')
}

export const postList = (param: PostListReq) => {
  return request.get<CommonResp<PageContent<PostListItemResp>>>('/api/v1/admin/posts', {
    params: param,
  })
}

export const postInfo = (param: InfoReq) => {
  return request.get<CommonResp<PostInfoResp>>(`/api/v1/admin/posts/${param.id}`)
}

export const postCreate = (param: PostCreateReq) => {
  return request.post<CommonResp>('/api/v1/admin/posts', param)
}

export const postUpdate = (id: number, param: PostUpdateReq) => {
  return request.put<CommonResp>(`/api/v1/admin/posts/${id}`, param)
}

export const postDelete = (param: DeleteReq) => {
  return request.delete<CommonResp>(`/api/v1/admin/posts/${param.id}`)
}
