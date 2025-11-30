import { RouteRecordRaw } from 'vue-router'
import systemRoutes from './module/systemRoutes'

// 业务动态路由
const dynamicRoutes: RouteRecordRaw[] = [...systemRoutes]

export default dynamicRoutes
