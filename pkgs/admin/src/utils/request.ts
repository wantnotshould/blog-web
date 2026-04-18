import { userRefreshToken } from '@/api/handler/user'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { getSignatureHeaders } from '@blog/shared'
import axios from 'axios'

const request = axios.create({
  timeout: 10000,
  withCredentials: true,
  // baseURL: import.meta.env.VITE_API_URL,
})

request.interceptors.request.use(config => {
  try {
    const sigHeaders = getSignatureHeaders(config)

    if (config.headers) {
      Object.entries(sigHeaders).forEach(([key, value]) => {
        config.headers.set(key, value)
      })
    }

    return config
  } catch (error) {
    return Promise.reject(error)
  }
})

let isRefreshing = false
let failedQueue: (() => void)[] = []

request.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const { response, config } = error
    const userStore = useUserStore()

    if (response && response.status === 401) {
      if (isRefreshing) {
        return new Promise(resolve => {
          failedQueue.push(() => {
            resolve(request(config))
          })
        })
      }

      isRefreshing = true

      try {
        const { data } = await userRefreshToken()
        if (data.status) {
          failedQueue.forEach(callback => callback())
          failedQueue = []
        } else {
          userStore.reset()
          router.push({ name: 'login' })
          return Promise.reject(error)
        }
      } catch (refreshError) {
        userStore.reset()
        router.push({ name: 'login' })
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default request
