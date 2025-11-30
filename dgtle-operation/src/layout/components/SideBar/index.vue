<script setup lang="ts">
import { ref, computed } from 'vue'
import MenuItem from './MenuItem.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store'

const userStore = useUserStore()
// 侧边栏
const sidebarRoutes = computed(() => {
  return userStore.sidebarRoutes
})

const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const handClick = (val) => {
  const breadcrumb = []
  route.matched.forEach((val) => {
    breadcrumb.push({
      title: val.meta.title,
      path: val.path
    })
  })
  console.log('🚀 ~ handClick ~ breadcrumb:', breadcrumb)
}
</script>

<template>
  <div class="side-bar-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :router="true"
        :unique-opened="true"
        mode="vertical"
        @select="handClick"
      >
        <MenuItem
          v-for="(route, index) in sidebarRoutes"
          :key="route.path + index"
          :routeInfo="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped></style>
