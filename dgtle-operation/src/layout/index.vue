<script setup lang="ts">
import AppMain from './components/AppMain/index.vue'
import NavBar from './components/NavBar/index.vue'
import SideBar from './components/SideBar/index.vue'
</script>

<template>
  <el-container>
    <el-header height="64px">
      <NavBar />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <SideBar />
      </el-aside>
      <el-main>
        <AppMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped></style>
