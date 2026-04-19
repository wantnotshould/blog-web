<script setup lang="ts">
import { useBlogList } from '@/compositions/useBlog'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{ p?: number }>()

const { loading, cond, res, query, changePage } = useBlogList()

watch(
  () => props.p,
  page => {
    const target = Number(page) || 1
    changePage(target)
  },
  { immediate: true }
)

const hasContent = computed(() => res.value.count > 0)

const totalPages = computed(() => Math.max(1, Math.ceil(res.value.count / cond.per_page)))

watch(totalPages, tp => {
  if (cond.page > tp) {
    changePage(1)
    router.replace({ name: 'posts-base' })
  }
})

const pagesArray = computed(() => {
  const current = cond.page
  const limit = 5

  let start = Math.max(current - Math.floor(limit / 2), 1)
  let end = Math.min(start + limit - 1, totalPages.value)

  if (end - start < limit - 1) {
    start = Math.max(end - limit + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr))

query()

const goPage = (page: number) => {
  if (page === 1) {
    router.push({ name: 'posts-base' })
  } else {
    router.push({ name: 'posts', params: { p: page } })
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePrevPage = () => {
  if (cond.page > 1) goPage(cond.page - 1)
}

const handleNextPage = () => {
  if (cond.page < totalPages.value) goPage(cond.page + 1)
}

const handlePageChange = (page: number) => {
  if (page !== cond.page) goPage(page)
}
</script>

<template>
  <div class="container">
    <h1>文章</h1>
    <div v-if="loading">⏳ 加载中...</div>
    <template v-else>
      <div v-if="!hasContent && !loading" class="empty-tips">
        <p>👀暂无文章～</p>
      </div>
      <div>
        <ul class="list">
          <li v-for="item in res.content" :key="item.slug">
            <span class="date">
              {{ formatDate(item.created_at) }}
            </span>
            <span
              class="title"
              @click="router.push({ name: 'cat', params: { slug: item.slug } })"
              >{{ item.title }}</span
            >
          </li>
        </ul>

        <div class="pagination" v-if="totalPages > 1">
          <span
            class="pagination-btn"
            :class="{ disabled: cond.page === 1 }"
            @click="handlePrevPage"
          >
            <
          </span>

          <div class="page-numbers">
            <span
              v-for="page in pagesArray"
              :key="page"
              class="page-number"
              :class="{
                active: page === cond.page,
              }"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </span>
          </div>

          <span
            class="pagination-btn"
            :class="{ disabled: cond.page >= totalPages }"
            @click="handleNextPage"
          >
            >
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
}

h1 {
  margin-bottom: 2rem;
}

.tips {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  margin-bottom: var(--cdme-small);

  h2 {
    padding-left: 0.6rem;
  }

  .tips-line {
    position: absolute;
    width: 4px;
    inset: 0 auto 0 0;
    height: 74%;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--cdme-accent);
    border-radius: var(--cdme-radius);
  }
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.list li {
  display: flex;
  align-items: baseline;
  padding: 0.3rem 0;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.date {
  flex: none;
  width: 160px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--cdme-text-second);
  margin-right: 1rem;
  text-align: right;
}

.title {
  flex: 1;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.3rem;
  cursor: pointer;
  line-height: 1.4;
}

.title:hover {
  color: var(--cdme-accent-hover);
}

@media (max-width: 768px) {
  .list li {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .date {
    width: auto;
    font-size: 0.85rem;
  }

  .title {
    font-size: 1rem;
  }
}

.pagination {
  background-color: var(--cdme-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--cdme-medium);
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: var(--cdme-medium) 0;
  z-index: 10;
}

.pagination-btn {
  margin: 0 10px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  padding: var(--cdme-small);
  border-radius: var(--cdme-small);
}

.pagination-btn.disabled {
  color: var(--cdme-page-disabled);
  cursor: not-allowed;
}

.pagination-btn:hover:not(.disabled) {
  background-color: var(--cdme-page-hover);
}

.page-numbers {
  display: flex;
  gap: 10px;
}

.page-number {
  padding: 5px 10px;
  background-color: transparent;
  cursor: pointer;
  border-radius: var(--cdme-radius);
  transition:
    background-color 0.3s,
    color 0.3s;
}

.page-number.active {
  background-color: var(--cdme-page-active);
  color: #fff;
}

.page-number:hover:not(.active):not(.disabled) {
  background-color: var(--cdme-page-hover);
}

.page-number.disabled {
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .pagination {
    padding: var(--cdme-small) 0;
  }
}
</style>
