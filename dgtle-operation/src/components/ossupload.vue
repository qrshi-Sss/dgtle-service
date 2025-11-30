<template>
  <el-upload
    v-model:file-list="fileList"
    v-bind="attrs"
    :http-request="handleUpload"
    :before-upload="beforeUpload"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :list-type="props.listType"
    :limit="props.limit"
  >
    <!-- 透传所有插槽 -->
    <template v-for="(_, slotName) in slots" #[slotName]="scope">
      <slot :name="slotName" v-bind="scope || {}" />
    </template>

    <!-- 默认插槽 -->
    <template v-if="!slots.default" #default>
      <el-icon class="el-icon--upload">
        <Plus />
      </el-icon>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import OSS from 'ali-oss'
import type { UploadFile, UploadRequestOptions, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { generationPath, createFileName } from '@/utils'
import { systemApi } from '@/api'
import { useUserStore } from '@/store'

defineOptions({
  name: 'Upload'
})

const VITE_APP_STATIC_API = import.meta.env.VITE_APP_STATIC_API
interface PropsType {
  listType: 'text' | 'picture' | 'picture-card'
  limit: number
  maxSizeMb?: number
  maxSizeKb?: number
  ossPath?: string
}
const props = withDefaults(defineProps<PropsType>(), {
  listType: 'picture-card',
  limit: 1,
  maxSizeMb: 1000,
  maxSizeKb: 200,
  ossPath: ''
})

const fileList = defineModel<UploadFile[]>('fileList', { default: [] })
const userStore = useUserStore()
const attrs = useAttrs()
const slots = useSlots()

const beforeUpload = (file: UploadRawFile) => {
  const fileNameArr = file.name.split('.')
  const fileType = fileNameArr[fileNameArr.length - 1]
  // 文件类型判断
  if (attrs.accept && typeof attrs.accept === 'string' && !attrs.accept.includes(fileType)) {
    ElMessage.warning(`当前文件拓展名并不包含在${attrs.accept}中，请重新选择`)
    return false
  }

  // 文件大小校验
  const maxSize = props.maxSizeMb
    ? props.maxSizeMb * 1024 * 1024
    : props.maxSizeKb
      ? props.maxSizeKb * 1024
      : 10 * 1024 * 1024

  if (file.size > maxSize) {
    const sizeText = props.maxSizeMb ? `${props.maxSizeMb}MB` : `${props.maxSizeKb}KB`
    ElMessage.error(`文件大小不能超过 ${sizeText}`)
    return false
  }

  return true
}

const getFreshOssClient = async () => {
  const res = await systemApi.getOssSign()
  return new OSS({
    region: 'oss-cn-hangzhou',
    accessKeyId: res.data.accessKeyId,
    accessKeySecret: res.data.accessKeySecret,
    stsToken: res.data.securityToken,
    bucket: res.data.bucket,
    secure: true,
    timeout: 360000
  })
}

const handleUpload = async (option: UploadRequestOptions) => {
  try {
    const client = await getFreshOssClient()
    const { file } = option
    const fileNameArr = file.name.split('.')
    const fileType = fileNameArr[fileNameArr.length - 1]
    const fileTypePath = generationPath(fileType)

    // 更新文件状态为上传中
    updateFileStatus(file.uid, {
      status: 'uploading',
      percentage: 0
    })

    // ossKey =  'web' + 业务类型 + 文件类型 + 用户ID +生成的文件名
    const ossKey =
      '/web/' +
      props.ossPath +
      `${fileTypePath}` +
      userStore.userInfo.userId +
      `${createFileName(file.name)}`

    // 大文件分片上传
    if (file.size > 10 * 1024 * 1024) {
      await client.multipartUpload(ossKey, file, {
        parallel: 4, // 并发数
        partSize: 1 * 1024 * 1024, //分片大小
        Expires: '1000', //过期时间
        'x-oss-storage-class': 'Standard', // 指定Object的存储类型。
        'x-oss-forbid-overwrite': 'true', // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
        progress: (p: number, cpt, res) => {
          // @ts-ignore
          option.onProgress({ percent: p * 100 })
        }
      })
    }
    // 小文件普通上传
    else {
      await client.put(ossKey, file)
    }

    const url = `${VITE_APP_STATIC_API}${ossKey}`
    // 更新fileList中对应的文件信息
    updateFileStatus(file.uid, {
      status: 'success',
      url,
      key: ossKey
    })
    option.onSuccess({
      url,
      key: ossKey,
      name: file.name
    })
  } catch (error: any) {
    updateFileStatus(option.file.uid, {
      status: 'fail',
      error
    })
    option.onError(error)
  }
}

// 更新fileList状态
const updateFileStatus = (uid, updates) => {
  const targetFile = fileList.value.find((f) => f.uid === uid)
  if (!targetFile) return
  Object.assign(targetFile, updates)
  if ('percentage' in updates) {
    targetFile.percentage = updates.percentage
  } else if (updates.status === 'success') {
    delete targetFile.percentage
  }
  fileList.value = [...fileList.value]
}

// 文件超出数量限制
const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
}
// 文件移除
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex((f) => f.uid === file.uid)
  if (index !== -1) {
    fileList.value.splice(index, 1)
  }
}
</script>
