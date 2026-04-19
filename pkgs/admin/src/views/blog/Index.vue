<script setup lang="ts">
import {
  handlerPostDelete,
  handlerPostPageChange,
  handlerPostPerPageChange,
  postCategoryRes,
  postListCond,
  postListRes,
  postOptionToMap,
  postStatusRes,
  queryPostCategory,
  queryPostList,
  queryPostListFormRef,
  queryPostStatus,
} from '@/compositions/useBlog'
import { listRules } from '@/rules/rule'
import { timeFormat } from '@blog/shared'

const router = useRouter()

queryPostCategory()
queryPostStatus()
queryPostList()

const categoryMap = computed(() => postOptionToMap(postCategoryRes.value))
const statusMap = computed(() => postOptionToMap(postStatusRes.value))
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <el-button type="primary" @click="router.push({ name: 'blog-create' })"> 创建 </el-button>
        </div>

        <el-form
          class="header-form"
          :inline="true"
          ref="queryPostListFormRef"
          :model="postListCond"
          :rules="listRules"
        >
          <el-form-item prop="keyword">
            <el-input
              placeholder="输入搜索内容..."
              autocomplete="off"
              clearable
              v-model="postListCond.keyword"
            />
          </el-form-item>

          <el-form-item label="分类" prop="category_id">
            <el-select style="width: 260px" v-model="postListCond.category_id">
              <el-option label="全部" :value="0" />
              <el-option
                v-for="item in postCategoryRes"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select style="width: 260px" v-model="postListCond.status">
              <el-option label="全部" :value="0" />
              <el-option
                v-for="item in postStatusRes"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click="queryPostListFormRef?.resetFields()">重置</el-button>
            <el-button type="primary" @click="queryPostList(postListCond)"> 搜索 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>

    <el-table :data="postListRes.content" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center" />

      <el-table-column label="分类" prop="category_id" width="180" align="center">
        <template #default="{ row }">
          <el-tag>
            {{ categoryMap[row.category_id] || row.category_id }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题" width="180" align="center" />

      <el-table-column prop="slug" label="Slug" width="180" align="center" />

      <el-table-column prop="status" label="状态" width="130" align="center">
        <template #default="{ row }">
          <el-tag>
            {{ statusMap[row.status] || row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" v-slot="{ row }" width="260" align="center" fixed="right">
        <el-button
          type="primary"
          text
          @click="router.push({ name: 'blog-update', params: { id: row.id } })"
        >
          编辑
        </el-button>

        <el-button type="danger" text @click="handlerPostDelete({ id: row.id })"> 删除 </el-button>
      </el-table-column>

      <el-table-column
        prop="created_at"
        :formatter="timeFormat"
        label="创建时间"
        width="230"
        align="center"
      />
    </el-table>

    <template #footer>
      <el-pagination
        v-model:current-page="postListCond.page"
        v-model:page-size="postListCond.per_page"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="postListRes.count"
        @size-change="handlerPostPerPageChange"
        @current-change="handlerPostPageChange"
      />
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.header-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  .el-form-item {
    margin-bottom: 0;
  }
}
.tag-item {
  margin-right: 6px;
  margin-bottom: 4px;
}
</style>
