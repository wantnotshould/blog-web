<script setup lang="ts">
import MdEditor from '@/components/MdEditor.vue'
import {
  handlerBlogCreate,
  postCategoryRes,
  postStatusRes,
  queryPostCategory,
  queryPostStatus,
} from '@/compositions/useBlog'
import { BlogCategory, BlogStatus } from '@/enums/post'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  title: '',
  slug: '',
  category_id: BlogCategory.Essay,
  summary: '',
  status: BlogStatus.Draft,
  content: '',
})

const handlerCreate = async () => {
  const result = await handlerBlogCreate(formData.value)

  if (result) {
    ElMessage.success('Success')
    router.push({ name: 'blog' })
  }
}

const handlerReset = () => {
  formData.value = {
    title: '',
    slug: '',
    category_id: BlogCategory.Essay,
    summary: '',
    status: BlogStatus.Draft,
    content: '',
  }
}

queryPostCategory()
queryPostStatus()
</script>

<template>
  <el-card>
    <template #header>
      <span>写文章</span>
    </template>

    <el-form :model="formData" label-width="120px">
      <el-form-item label="Title">
        <el-input v-model="formData.title" />
      </el-form-item>

      <el-form-item label="Category">
        <el-select v-model="formData.category_id" placeholder="Select category">
          <el-option
            v-for="item in postCategoryRes"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Slug">
        <el-input v-model="formData.slug" />
      </el-form-item>

      <el-form-item label="Summary">
        <el-input type="textarea" v-model="formData.summary" />
      </el-form-item>

      <el-form-item label="Status">
        <el-select v-model="formData.status">
          <el-option
            v-for="item in postStatusRes"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Content">
        <MdEditor v-model="formData.content" height="400px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handlerCreate"> 创建 </el-button>
        <el-button @click="handlerReset"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped></style>
