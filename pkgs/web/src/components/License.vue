<script setup lang="ts">
const app = import.meta.env.VITE_APP
// https://cn.vuejs.org/api/general#definecomponent
const props = defineProps({
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div class="musei-license">
    <div>作者: {{ app }}</div>
    <div>
      链接:
      <a :href="props.link" target="_blank" rel="noopener noreferrer">
        {{ props.link }}
      </a>
    </div>
    <div v-if="createdAt">发布：{{ createdAt }}</div>
    <div>
      本文采用
      <a
        href="https://creativecommons.org/licenses/by-nc/4.0/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="访问知识共享署名-非商业性使用 4.0 国际许可协议"
        class="current-licenses"
      >
        知识共享署名-非商业性使用 4.0 国际许可协议
      </a>
      进行许可。
    </div>
    <div>转载或引用本文时请遵守许可协议，注明出处、不得用于商业用途！</div>
  </div>
</template>

<style lang="scss" scoped>
.musei-license {
  font-size: 0.9rem;
  color: var(--cdme-text-second);
  line-height: 1.6;
  border-top: 1px solid var(--cdme-border);
  padding-top: var(--cdme-medium);
  display: flex;
  flex-direction: column;
  gap: var(--cdme-small);
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding-top: var(--cdme-small);
  }
  a {
    color: var(--cdme-a);
    transition: color 0.2s;

    &:hover {
      color: var(--cdme-accent);
      text-decoration: underline;
    }
  }

  strong {
    color: var(--cdme-accent);
  }
}
.current-licenses {
  font-weight: 500;
}
</style>
