import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import dynamicRoutes from '@/router/routes'
import router from '@/router'
import { setToken } from '@/utils/auth'

interface UserState {
  isLogin: boolean //是否登录
  permission: string[] //拥有的权限
  defaultRoutes: string //默认选中路由
  sidebarRoutes: RouteRecordRaw[] // 侧边菜单栏路由
}

const useUserStore = defineStore('User', {
  state: (): UserState => ({
    isLogin: false,
    permission: [],

    //路由
    defaultRoutes: '',
    sidebarRoutes: []
  }),
  getters: {},
  actions: {
    // 登录
    login() {
      this.isLogin = true
      setToken('11111')
    },
    // 获取用户信息逻辑
    getUserInfo() {
      this.permission = ['1']
      this.setSidebarRoutes()
    },
    // 过滤路由 && 设置侧边栏权限
    setSidebarRoutes() {
      const filterRouter = filterRoutes(dynamicRoutes, this.permission)
      filterRouter.forEach((route) => {
        router.addRoute('root-layout', route)
      })
      this.sidebarRoutes = filterRouter
      return filterRouter
    }
  }
})

/**
 * @param routes 路由
 * @param userPermission 用户权限列表
 * @return 过滤后的路由
 */
function filterRoutes(routes: RouteRecordRaw[], userPermission): RouteRecordRaw[] {
  return routes.filter((route) => {
    // 判断当前路由是否有权限
    if (!hasPermission(route.meta?.permission as string, userPermission)) {
      return false
    }

    // 递归处理子路由
    if (route.children) {
      route.children = filterRoutes(route.children, userPermission)
      // 如果过滤后子路由为空，且当前路由没有重定向，则过滤掉该路由
      if (route.children.length === 0 && !route.redirect) {
        return false
      }
    }
    return true
  })
}

/**
 * @description  判断是否有该权限
 * */
function hasPermission(permission, userPermission) {
  return userPermission.includes(permission)
}

export default useUserStore
