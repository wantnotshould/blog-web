<script setup lang="ts">
import { userLogout } from '@/api/handler/user'
import { useUIState } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'
import { removeItem } from '@blog/shared'
import { ArrowDown, Expand, Fold, Moon, Sunny, SwitchButton } from '@element-plus/icons-vue'

const uiState = useUIState()
const router = useRouter()
const userStore = useUserStore()
const username = computed(() => userStore.username)

const handlerUserLogout = async () => {
  await ElMessageBox.confirm('确认要退出吗', '退出', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => {
    ElMessage.info('已取消退出')
    return new Promise(() => {})
  })
  try {
    await userLogout()
  } catch {
  } finally {
    userStore.reset()
    removeItem('pinia-user')
  }
  ElMessage.success('成功退出')
  router.push('/login')
}
</script>

<template>
  <el-header>
    <el-icon @click="uiState.toggleCollapse">
      <el-icon v-show="uiState.isCollapse"><expand /></el-icon>
      <el-icon v-show="uiState.isCollapse"><fold /></el-icon>
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
        <el-icon v-if="uiState.isDark"><sunny /></el-icon>
        <el-icon v-else><moon /></el-icon>
      </el-icon>

      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :size="34">
            <template #default>
              <span>{{ username.charAt(0) }}</span>
            </template>
          </el-avatar>
          <el-icon class="el-icon--right">
            <el-icon><arrow-down /></el-icon>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item divided @click="handlerUserLogout">
              <el-icon>
                <switch-button />
              </el-icon>
              <span>退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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

  .el-dropdown-link {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 16px;
  }

  .el-dropdown-menu {
    min-width: 160px;
  }

  .el-avatar {
    margin-right: 8px;
  }
}
</style>
