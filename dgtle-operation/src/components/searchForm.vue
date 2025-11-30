<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import { ArrowDown, ArrowUp, Search, Refresh } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

defineOptions({
  name: 'SearchForm'
})

// Props 定义
const props = defineProps({
  col: {
    type: Number,
    default: 4 // 默认每行4列
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const modelValue = defineModel({
  type: Object,
  default: () => ({})
})
const emit = defineEmits(['handleSearch', 'handleReset'])
const slots = useSlots()
const formRef = ref<FormInstance>()
const isExpanded = ref(true)

// 每个筛选项的栅格数
const itemColSpan = computed(() => {
  return 24 / props.col
})

// 获取所有表单项（从默认插槽）
const allItems = computed(() => {
  const defaultSlot = slots.default?.() || []
  const formItems = defaultSlot.filter((item) => {
    const typeName =
      typeof item.type === 'object' && item.type !== null ? (item.type as any)?.name : undefined
    return typeName === 'ElFormItem' || item.type === 'ElFormItem'
  })
  return formItems
})

// 计算可见的表单项
const visibleItems = computed(() => {
  if (isExpanded.value) {
    return allItems.value
  }
  return allItems.value.slice(0, props.col)
})

const handleSearch = () => {
  emit('handleSearch')
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('handleReset')
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="search-form">
    <el-form ref="formRef" class="form" :model="modelValue">
      <el-row :gutter="20" justify="start">
        <template v-for="(item, index) in visibleItems" :key="index">
          <el-col :span="itemColSpan">
            <component :is="item" />
          </el-col>
        </template>
      </el-row>
    </el-form>

    <div class="search-actions">
      <el-button :icon="Search" :loading="loading" type="primary" @click="handleSearch">
        查询
      </el-button>
      <el-button :icon="Refresh" :loading="loading" @click="handleReset">重置</el-button>
      <slot name="action"></slot>
      <el-button
        v-if="allItems.length > props.col"
        type="text"
        :icon="isExpanded ? ArrowUp : ArrowDown"
        @click="toggleExpand"
      >
        {{ isExpanded ? '收起' : '展开' }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  .search-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
