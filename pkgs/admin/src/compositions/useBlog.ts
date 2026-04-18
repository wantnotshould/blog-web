import {
  postCategory,
  postCreate,
  postDelete,
  postInfo,
  postList,
  postStatus,
  postUpdate,
} from '@/api/handler/blog'
import type { PostCreateReq, PostListReq, PostUpdateReq } from '@/api/req/blog'
import type { DeleteReq, InfoReq } from '@/api/req/req'
import type { PostInfoResp, PostListItemResp, PostOptionItemResp } from '@/api/resp/blog'
import type { PageContent } from '@/api/resp/resp'
import { handlerError } from '@/utils/error'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'

export const postOptionToMap = (list: PostOptionItemResp[]) => {
  const map: Record<number, string> = {}
  list.forEach(item => {
    map[Number(item.id)] = item.label
  })
  return map
}

export const postCategoryRes = ref<PostOptionItemResp[]>([])
export const queryPostCategory = async () => {
  try {
    const { data } = await postCategory()
    if (data.status) {
      postCategoryRes.value = data.data
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
  } finally {
  }
}

export const postStatusRes = ref<PostOptionItemResp[]>([])
export const queryPostStatus = async () => {
  try {
    const { data } = await postStatus()
    if (data.status) {
      postStatusRes.value = data.data
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
  } finally {
  }
}

export const blogListLoading = ref(false)
export const blogListCond = reactive<PostListReq>({
  category_id: 0,
  status: 0,
  page: 1,
  per_page: 20,
})
export const blogListRes = ref<PageContent<PostListItemResp>>({
  count: 0,
  content: [],
})

export const queryBlogList = async (param: PostListReq = { page: 1, per_page: 20 }) => {
  blogListLoading.value = true
  Object.assign(blogListCond, param)
  try {
    const { data } = await postList(param)
    if (data.status) {
      blogListRes.value = data.data
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
  } finally {
    blogListLoading.value = false
  }
}
export const handlerBlogPageChange = (page: number) => {
  blogListCond.page = page
  queryBlogList(blogListCond)
}
export const handlerBlogPerPageChange = (perPage: number) => {
  blogListCond.per_page = perPage
  handlerBlogPageChange(1)
}

export const blogInfoLoading = ref(false)
export const blogInfoRes = ref<PostInfoResp>({
  id: 0,
  category_id: 1,
  title: '',
  slug: '',
  summary: '',
  content: '',
  status: 1,
  created_at: '',
})
export const queryBlogInfo = async (param: InfoReq) => {
  blogInfoLoading.value = true
  try {
    const { data } = await postInfo(param)
    if (data.status) {
      blogInfoRes.value = data.data
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
  } finally {
    blogInfoLoading.value = false
  }
}

export const blogCreateLoading = ref(false)
export const handlerBlogCreate = async (param: PostCreateReq) => {
  blogCreateLoading.value = true

  try {
    const { data } = await postCreate(param)
    if (data.status) {
      return true
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    handlerError(err)
  } finally {
    blogCreateLoading.value = false
  }
}

export const blogUpdateLoading = ref(false)
export const handlerBlogUpdate = async (id: number, param: PostUpdateReq) => {
  blogUpdateLoading.value = true

  try {
    const { data } = await postUpdate(id, param)
    if (data.status) {
      return true
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    handlerError(err)
  } finally {
    blogUpdateLoading.value = false
  }
}

export const blogDeleteLoading = ref(false)
export const handlerBlogDelete = async (param: DeleteReq) => {
  const confirmDelete = await ElMessageBox.confirm(
    'Are you sure you want to delete this item?',
    'Confirm Deletion',
    {
      type: 'warning',
    }
  ).catch(() => {
    ElMessage.info('Deletion canceled')
    return false
  })

  if (!confirmDelete) return

  blogDeleteLoading.value = true
  try {
    const { data } = await postDelete(param)
    if (data.status) {
      ElMessage.success('Deleted successfully')
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    handlerError(err)
  } finally {
    blogDeleteLoading.value = false
    queryBlogList()
  }
}
