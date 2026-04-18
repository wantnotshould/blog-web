<script setup lang="ts">
import { useUIState } from '@/stores/uiStore'

const uiState = useUIState()
</script>

<template>
  <el-header>
    <el-icon @click="uiState.toggleCollapse">
      <i-ep-Expand v-show="uiState.isCollapse" />
      <i-ep-Fold v-show="!uiState.isCollapse" />
    </el-icon>

    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in $route.matched"
        :key="index"
        :to="{ path: item.path }"
        >{{ item.meta.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>

    <div class="header-right">
      <el-icon @click="uiState.toggleTheme()">
        <i-ep-sunny v-if="uiState.isDark" />
        <i-ep-moon v-else />
      </el-icon>
    </div>
  </el-header>
</template>
<style lang="scss" scoped>
.el-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 3px rgba(2, 6, 8, 0.1);

  .el-icon {
    margin-right: 16px;
    cursor: pointer;
  }

  .el-breadcrumb {
    flex-grow: 1;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
