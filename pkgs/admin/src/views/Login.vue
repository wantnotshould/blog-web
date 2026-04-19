<script setup lang="ts">
import { useLogin } from '@/compositions/useLogin'
import { loginRules } from '@/rules/user'
import { useUIState } from '@/stores/uiStore'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const uiState = useUIState()
const router = useRouter()
const route = useRoute()

const { loginFormRef, loginForm, loading, login } = useLogin()

const handleLogin = async () => {
  const ok = await login()
  if (!ok) return

  ElMessage.success('登录成功')

  const redirect = route.query.r
  router.replace(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/')
}
</script>

<template>
  <div class="login">
    <div class="theme-toggle">
      <el-icon @click="uiState.toggleTheme()">
        <el-icon v-if="uiState.isDark"><sunny /></el-icon>
        <el-icon v-else><moon /></el-icon>
      </el-icon>
    </div>

    <div class="login-panel">
      <el-form
        ref="loginFormRef"
        :rules="loginRules"
        :model="loginForm"
        label-position="top"
        size="large"
        class="form-login"
        @keydown.enter="handleLogin"
      >
        <div class="logo-container">
          <img src="@/assets/img/logo.png" class="logo" />
          <h2>cdme</h2>
        </div>

        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号" autocomplete="off" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 16px;

  .theme-toggle {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }

  .login-panel {
    width: 360px;
    padding: 30px;
    border-radius: 12px;
    border: 1px solid var(--cdme-border);
    background: var(--cdme-bg);

    .logo-container {
      text-align: center;
      margin-bottom: 20px;

      .logo {
        width: 57px;
        height: 57px;
        border-radius: 50%;
        margin-bottom: 8px;
      }
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>
