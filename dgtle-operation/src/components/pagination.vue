<script setup lang="ts">
defineOptions({
  name: 'Pagination'
})

const props = withDefaults(
  defineProps<{
    total?: number
    pageSizes?: number[]
    layout?: string
    size?: 'default' | 'small' | 'large'
  }>(),
  {
    total: 0,
    pageSizes: () => [10, 20, 50],
    layout: 'total, sizes, prev, pager, next, jumper',
    size: 'default'
  }
)

const currentPage = defineModel<number>('currentPage', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const emit = defineEmits(['pagination'])
const handleSizeChange = (val: number) => {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
}
const handleCurrentChange = (val: number) => {
  emit('pagination', { page: val, limit: pageSize.value })
}
</script>

<template>
  <div class="pagination">
    <el-pagination
      v-bind="$attrs"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="props.total"
      :page-sizes="props.pageSizes"
      :layout="props.layout"
      background
      :size="size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 12px;

  // :deep(.el-pagination.is-background .el-pager li.is-active) {
  //   background-color: #0052d9 !important;
  //   color: #fff;
  // }
}
</style>
