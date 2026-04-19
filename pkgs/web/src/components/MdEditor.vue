<script setup lang="ts">
import { config, MdCatalog, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

config({
  editorExtensions: {},
})

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  summary: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  showCatalog: {
    type: Boolean,
    default: true,
  },
  isDark: {
    type: Boolean,
    required: true,
  },
})

const dynamicId = 'md-id'
const scrollElement = document.documentElement
</script>

<template>
  <div class="md-main">
    <div class="md-con">
      <div class="md-tit" v-if="title || summary">
        <h1>{{ title }}</h1>
        <span class="summary">{{ summary }}</span>
      </div>
      <MdPreview
        :id="dynamicId"
        :modelValue="content"
        :theme="isDark ? 'dark' : 'light'"
        previewTheme="github"
        :no-mermaid="true"
        :no-katex="true"
        :no-echarts="true"
        :codeFoldable="false"
        :no-highlight="true"
      />
    </div>
    <div class="md-catalog" v-if="showCatalog">
      <MdCatalog :editorId="dynamicId" :scrollElement="scrollElement" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.md-main {
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .md-con {
    flex: 1;
    min-width: 300px;

    .md-tit {
      padding: 1rem 0;

      h1 {
        padding-bottom: 0.8rem;
      }

      .summary {
        color: var(--musei-text-second);
      }
    }
  }

  .md-catalog {
    width: 260px;
    min-width: 200px;
    position: sticky;
    top: 80px;
    align-self: flex-start;
  }
}

:deep(.md-editor-preview) {
  --md-theme-heading-2-border: 1px solid var(--musei-border) !important;
}
:deep(.md-editor-catalog-indicator) {
  background-color: var(--musei-accent);
}
:deep(.md-editor-catalog-active > span) {
  color: var(--musei-accent);
}
:deep(.md-editor-catalog-link span:hover) {
  color: var(--musei-accent-hover);
}
:deep(#preview-only-preview) {
  padding: var(--musei-small);
}
:deep(.md-editor) {
  border-radius: var(--musei-radius);
}
:deep(.md-editor-dark),
:deep(.md-editor-modal-container) {
  --md-bk-color: var(--musei-bg);
}
:deep(.md-editor-preview .md-editor-code .md-editor-code-head) {
  z-index: 9;
}

@media (max-width: 992px) {
  .md-con {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .md-catalog {
    width: 100%;
    position: static !important;
    top: auto;
    margin-top: var(--musei-small);
  }
}
</style>
