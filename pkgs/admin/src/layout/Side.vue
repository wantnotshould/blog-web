<script setup lang="ts">
import { useUIState } from '@/stores/uiStore'
import { Guide, Memo } from '@element-plus/icons-vue'

const uiState = useUIState()
</script>

<template>
  <el-aside>
    <el-menu router unique-opened :collapse="uiState.isCollapse">
      <a href="/" class="logo">
        <img src="@/assets/img/logo.png" alt="" />
        <h1>cdme</h1>
      </a>
      <el-menu-item index="/">
        <el-icon><guide /></el-icon><span>首页</span>
      </el-menu-item>
      <el-menu-item index="/blog">
        <el-icon><memo /></el-icon><span>博客</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside {
  height: 100vh;
  width: auto;
  background-color: var(--cdme-menu-bg);
  border-right: 1px solid var(--cdme-border);
  transition: width 0.2s ease;

  .el-menu {
    width: 230px;
    border-right: none;
    white-space: nowrap;
    background-color: var(--cdme-menu-bg);
    color: var(--cdme-text);

    &.el-menu--collapse {
      width: 60px;

      h1 {
        display: none;
      }
    }

    .el-menu-item {
      color: var(--cdme-text);

      &:hover {
        background-color: var(--cdme-menu-bg);
        color: var(--cdme-text);
      }

      &.is-active {
        background-color: var(--cdme-menu-bg);
        color: var(--cdme-text);
      }
    }
  }

  :deep(.el-sub-menu__title) {
    background-color: var(--cdme-menu-bg);
    color: var(--cdme-text);

    &:hover {
      background-color: var(--cdme-menu-bg);
      color: var(--cdme-text);
    }
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    background-color: var(--cdme-menu-bg);
    color: var(--cdme-text);
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--cdme-gap-small);

    height: 60px;
    text-decoration: none;

    color: var(--cdme-text);
    font-size: var(--cdme-font-size-small);

    img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
    }

    h1 {
      font-size: var(--cdme-font-size-large);
      margin: 0;
    }
  }
}
</style>
