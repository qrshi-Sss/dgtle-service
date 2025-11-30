import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from 'axios'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

// 创建axios实例
const instance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_ENV === 'development' ? '/api' : import.meta.env.VITE_APP_BASE_URL,
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1.添加token
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    // 1.文件二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (res.data.code !== 200) {
      // 2.token失效
      if (res.data.code === 401) {
        ElMessage.warning('登录已过期，请重新登录')
        sessionStorage.removeItem('token')
        window.location.href = '/login'
      } else {
        // 3.其他错误
        ElMessage.warning(res.data.message || '服务器错误')
      }
      return Promise.reject(res.data)
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error: AxiosError) => {
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 封装通用请求方法
// 移除默认的 any 类型，让调用者必须显式指定类型
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await instance(config)
  return response.data
}
