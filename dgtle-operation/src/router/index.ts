import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'root-layout',
    path: '/',
    component: Layout,
    children: []
  },
  { path: '/login', component: () => import('@/views/system/login.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/system/404.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
