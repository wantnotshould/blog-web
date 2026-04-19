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

export default request
