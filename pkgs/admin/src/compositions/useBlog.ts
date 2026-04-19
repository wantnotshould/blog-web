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
import { handlerError, handlerFormValidationError } from '@/utils/error'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
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

export const postListLoading = ref(false)
export const postListCond = reactive<PostListReq>({
  category_id: 0,
  status: 0,
  page: 1,
  per_page: 20,
})
export const postListRes = ref<PageContent<PostListItemResp>>({
  count: 0,
  content: [],
})
export const queryPostListFormRef = ref<FormInstance>()
export const queryPostList = async (param: PostListReq = { page: 1, per_page: 20 }) => {
  try {
    await queryPostListFormRef.value?.validate()
  } catch (err) {
    handlerFormValidationError(err)
    return
  }

  postListLoading.value = true

  Object.assign(postListCond, param)

  try {
    const { data } = await postList(param)

    if (data.status) {
      postListRes.value = data.data
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    handlerError?.(err)
  } finally {
    postListLoading.value = false
  }
}
export const handlerPostPageChange = (page: number) => {
  postListCond.page = page
  queryPostList(postListCond)
}
export const handlerPostPerPageChange = (perPage: number) => {
  postListCond.per_page = perPage
  handlerPostPageChange(1)
}

export const postInfoLoading = ref(false)
export const postInfoRes = ref<PostInfoResp>({
  id: 0,
  category_id: 1,
  title: '',
  slug: '',
  summary: '',
  content: '',
  status: 1,
  created_at: '',
})
export const queryPostInfo = async (param: InfoReq) => {
  postInfoLoading.value = true
  try {
    const { data } = await postInfo(param)
    if (data.status) {
      postInfoRes.value = data.data
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
  } finally {
    postInfoLoading.value = false
  }
}

export const postCreateLoading = ref(false)
export const postCreateFormRef = ref<FormInstance>()
export const handlerPostCreate = async (param: PostCreateReq) => {
  try {
    await postCreateFormRef.value?.validate()
  } catch (err) {
    handlerFormValidationError(err)
    return false
  }

  postCreateLoading.value = true

  try {
    const { data } = await postCreate(param)
    return !!data.status
  } catch (err) {
    handlerError(err)
    return false
  } finally {
    postCreateLoading.value = false
  }
}

export const postUpdateLoading = ref(false)
export const postUpdateFormRef = ref<FormInstance>()
export const handlerPostUpdate = async (id: number, param: PostUpdateReq) => {
  try {
    await postUpdateFormRef.value?.validate()
  } catch (err) {
    handlerFormValidationError(err)
    return false
  }

  postUpdateLoading.value = true

  try {
    const { data } = await postUpdate(id, param)
    if (data.status) {
      return true
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    handlerError(err)
    return false
  } finally {
    postUpdateLoading.value = false
  }
}

export const postDeleteLoading = ref(false)
export const handlerPostDelete = async (param: DeleteReq) => {
  const confirmDelete = await ElMessageBox.confirm('确定要删除吗？', '删除确认', {
    type: 'warning',
  }).catch(() => {
    ElMessage.info('删除取消')
    return false
  })

  if (!confirmDelete) return

  postDeleteLoading.value = true
  try {
    const { data } = await postDelete(param)
    if (data.status) {
      ElMessage.success('删除成功')
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    handlerError(err)
    return false
  } finally {
    postDeleteLoading.value = false
    queryPostList()
  }
}
