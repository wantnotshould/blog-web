<script setup lang="ts">
import { useUIState } from '@/stores/uiStore'
import { MdEditor, type ToolbarNames, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { computed } from 'vue'

config({
  editorExtensions: {},
})

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const uiState = useUIState()

const editorValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const toolbars: ToolbarNames[] = [
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'title',
  'unorderedList',
  'orderedList',
  'task',
  'quote',
  'codeRow',
  'code',
  'link',
  'table',
  'revoke',
  'next',
  'fullscreen',
  'preview',
]
</script>

<template>
  <MdEditor
    v-model="editorValue"
    :theme="uiState.isDark ? 'dark' : 'light'"
    :toolbars="toolbars"
    preview-theme="github"
    :preview="false"
    v-bind="$attrs"
    :no-mermaid="true"
    :no-katex="true"
    :no-echarts="true"
    :codeFoldable="false"
    :no-highlight="true"
  />
</template>

<style lang="scss" scoped></style>
