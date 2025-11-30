<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  routeInfo: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

const { routeInfo, basePath } = props

const isMenuItem = () => {
  // 1、不存在子路由 2、存在子路由（新增，编辑，详情页）理论上还是菜单项
  return !routeInfo.children || routeInfo.meta.isMenuItem
}
</script>

<template>
  <div v-if="!routeInfo.meta.hidden">
    <template v-if="isMenuItem()">
      <!-- <router-link :to="routeInfo.path"> -->
      <el-menu-item :index="routeInfo.path">
        <template #title>
          <span class="menu-title">
            {{ routeInfo.meta.title }}
          </span>
        </template>
      </el-menu-item>
      <!-- </router-link> -->
    </template>

    <template v-else>
      <el-sub-menu ref="subMenu" :index="routeInfo.path" popper-append-to-body>
        <template #title>
          <span class="menu-title">
            {{ routeInfo.meta.title }}
          </span>
        </template>
        <!-- 存在子菜单：递归调用组件 -->
        <MenuItem
          v-for="(route, index) in routeInfo.children"
          :key="route.path + index"
          :routeInfo="route"
          :base-path="route.path"
        />
      </el-sub-menu>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
