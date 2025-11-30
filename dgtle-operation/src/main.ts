import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss' // global css
import { createPinia } from 'pinia'
import { permissionDirective } from '@/directive/permission'
import '@/router/permissionGuard'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
// 自定义权限指令
app.directive('permission', permissionDirective)
app.mount('#app')
