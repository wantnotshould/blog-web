<script setup lang="ts">
import Header from './Header.vue'
import Side from './Side.vue'
</script>

<template>
  <div>
    <el-container>
      <Side />
      <el-container class="admin-container">
        <Header />
        <el-main>
          <el-scrollbar>
            <router-view />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.admin-container {
  flex-direction: column;
  height: 100vh;

  .el-main {
    background-color: var(--cdme-bg);
  }
}
</style>
