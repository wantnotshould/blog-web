<script setup lang="ts">
import MdEditor from '@/components/MdEditor.vue'
import {
  handlerPostUpdate,
  postCategoryRes,
  postInfoRes,
  postStatusRes,
  postUpdateFormRef,
  queryPostCategory,
  queryPostInfo,
  queryPostStatus,
} from '@/compositions/useBlog'
import { postSaveRules } from '@/rules/post'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

queryPostCategory()
queryPostStatus()

// load data
queryPostInfo({ id: props.id })

const handlerUpdate = async () => {
  const form = postUpdateFormRef.value
  if (!form) return

  const data = postInfoRes.value

  const result = await handlerPostUpdate(data.id, {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    category_id: data.category_id,
    content: data.content,
    status: data.status,
  })

  if (result) {
    ElMessage.success('Success')
    router.push({ name: 'blog' })
  }
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>更新文章</span>
      </div>
    </template>

    <el-form :model="postInfoRes" label-width="120px" ref="postUpdateFormRef" :rules="postSaveRules(true)">
      <el-form-item label="标题" prop="title">
        <el-input v-model="postInfoRes.title" placeholder="输入标题" autocomplete="off" />
      </el-form-item>

      <el-form-item label="分类" prop="category_id">
        <el-select v-model="postInfoRes.category_id" style="width: 200px" clearable>
          <el-option
            v-for="item in postCategoryRes"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Slug" prop="slug">
        <el-input v-model="postInfoRes.slug" placeholder="Enter a URL-friendly slug" clearable />
      </el-form-item>

      <el-form-item label="描述" prop="summary">
        <el-input
          v-model="postInfoRes.summary"
          type="textarea"
          :rows="3"
          placeholder="输入描述信息"
          clearable
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="postInfoRes.status" placeholder="Select status" style="width: 200px">
          <el-option
            v-for="item in postStatusRes"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <MdEditor v-model="postInfoRes.content" height="400px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handlerUpdate"> 更新 </el-button>
        <el-button @click="router.push({ name: 'blog' })"> 取消 </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped></style>
