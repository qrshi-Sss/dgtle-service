import { checkPermission } from '@/utils/permission'
/**
 * v-permission指令
 * 使用方式: v-permission="'权限标识'"
 */
export const permissionDirective = {
  mounted(el: HTMLElement, binding: { value: string }) {
    if (!checkPermission(binding.value)) {
      el.style.display = 'none'
    }
  }
}
