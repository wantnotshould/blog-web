import { blogList } from '@/api/handler/blog'
import type { ListReq } from '@/api/req/req'
import type { BlogListItemResp } from '@/api/resp/blog'
import type { PageContent } from '@/api/resp/resp'

export function useBlogList() {
  const loading = ref(false)

  const res = ref<PageContent<BlogListItemResp>>({
    count: 0,
    content: [],
  })

  const query = async (param: ListReq) => {
    loading.value = true

    try {
      const { data } = await blogList(param)

      if (!data.status) {
        throw new Error(data.message)
      }

      res.value = data.data
    } catch (err) {
      console.error('[useBlogList error]', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    res,
    query,
  }
}
