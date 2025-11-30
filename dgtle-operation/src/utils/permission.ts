import { useUserStore } from '@/store'

/**
 * @description 校验权限
 * @param permission 权限标识
 * */
export function checkPermission(permission: string): boolean {
  const userStore = useUserStore()
  const userPermission = userStore.permission
  return userPermission.includes(permission)
}
