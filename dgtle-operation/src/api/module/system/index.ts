import { request } from '@/api/request'

export function login(data: any) {
  return request({
    url: '/system/login',
    method: 'post',
    data
  })
}
