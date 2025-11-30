// 全局拦截校验权限
// 动态加载路由
import router from '@/router'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store'

// 免登录名单
const whiteList = ['/login']
let flag = true

router.beforeEach((to, from, next) => {
  if (getToken()) {
    // 权限为空
    if (useUserStore().permission.length === 0 && flag) {
      useUserStore().getUserInfo()
      flag = false //避免死循环
      next({ ...to, replace: true }) //确保添加完动态路由
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})
