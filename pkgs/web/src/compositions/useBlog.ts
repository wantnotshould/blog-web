import { blogList } from '@/api/handler/blog'
import type { ListReq } from '@/api/req/req'
import type { BlogListItemResp } from '@/api/resp/blog'
import type { PageContent } from '@/api/resp/resp'

export function useBlogList() {
  const loading = ref(false)

  const cond = reactive<ListReq>({
    per_page: 20,
    page: 1,
  })

  const res = ref<PageContent<BlogListItemResp>>({
    count: 0,
    content: [],
  })

  const query = async (param?: Partial<ListReq>) => {
    loading.value = true

    try {
      const finalParam = {
        page: param?.page ?? cond.page,
        per_page: param?.per_page ?? cond.per_page,
      }

      cond.page = finalParam.page
      cond.per_page = finalParam.per_page

      const { data } = await blogList(finalParam)

      if (!data.status) {
        throw new Error(data.message || 'fetch blog list failed')
      }

      res.value = data.data
    } catch (err) {
      console.error('[useBlogList error]', err)
    } finally {
      loading.value = false
    }
  }

  const changePage = (page: number) => {
    query({ page })
  }

  const changePerPage = (perPage: number) => {
    query({ page: 1, per_page: perPage })
  }

  return {
    loading,
    cond,
    res,
    query,
    changePage,
    changePerPage,
  }
}
