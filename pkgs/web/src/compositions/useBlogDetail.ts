import { blogDetail } from '@/api/handler/blog'
import type { BlogDetailReq } from '@/api/req/blog'
import type { BlogDetailResp } from '@/api/resp/blog'

export function useBlogDetail() {
  const loading = ref(false)

  const res = ref<BlogDetailResp>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    created_at: '',
  })

  const error = ref<Error | null>(null)

  const query = async (param: BlogDetailReq) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await blogDetail(param)

      if (!data.status) {
        throw new Error(data.message || 'fetch blog detail failed')
      }

      res.value = data.data
      return data.data
    } catch (err: any) {
      console.error('[useBlogDetail error]', err)
      error.value = err
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    res,
    error,
    query,
  }
}
