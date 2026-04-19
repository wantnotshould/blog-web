<script setup lang="ts">
import { useBlogDetail } from '@/compositions/useBlogDetail'
import { useUIState } from '@/stores/uiStore'
import { timeFormatFromISO } from '@blog/shared'
import { computed, watch } from 'vue'

const props = defineProps<{ slug: string }>()

const { query, loading, res } = useBlogDetail()
const uiStore = useUIState()

const origin = computed(() => (typeof window !== 'undefined' ? window.location.origin : ''))

watch(
  () => props.slug,
  slug => {
    if (slug) query({ slug })
  },
  { immediate: true }
)

const ready = computed(() => !!res.value?.slug)
</script>

<template>
  <div class="container">
    <div v-if="loading">⏳ 加载中...</div>

    <div v-else-if="ready">
      <MdEditor
        :title="res.title"
        :summary="res.summary"
        :content="res.content"
        :is-dark="uiStore.isDark"
        :show-catalog="false"
      />

      <License :link="`${origin}/cat/${res.slug}`" :createdAt="timeFormatFromISO(res.created_at)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding-top: 0;
}
</style>
