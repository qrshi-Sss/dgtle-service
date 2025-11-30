import { defineStore } from 'pinia'

interface SystemState {
  // 定义状态类型
}

const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    // 初始化状态
  }),
  getters: {
    // 定义getters
  },
  actions: {
    // 定义actions
  }
})

export default useSystemStore
