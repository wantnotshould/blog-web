<script setup lang="ts">
import { useUIState } from '@/stores/uiStore'
import Footer from './Footer.vue'
import Header from './Header.vue'

const uiState = useUIState()
</script>

<template>
  <div class="layout">
    <Header />
    <main>
      <div class="main-con">
        <router-view />
      </div>
    </main>
    <Footer />
    <div class="theme" @click="uiState.toggleTheme">
      <div class="cdme-icon icon-mask"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  width: 100%;

  main {
    display: flex;
    flex: 1;
    width: 100%;

    .main-con {
      display: flex;
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 0 var(--cdme-large);

      @media (max-width: 768px) {
        padding: 0 var(--cdme-medium);
      }
    }
  }

  .theme {
    position: fixed;
    bottom: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    cursor: pointer;
    background-color: rgba(var(--cdme-theme-bg), 0.3);
    border-radius: 0.2rem;
    transition:
      transform 0.2s ease,
      background-color 0.3s;
    z-index: 100;

    .icon-mask {
      width: 26px;
      height: 26px;
    }
  }
}

[data-theme='light'] .icon-mask {
  -webkit-mask-image: var(--cdme-icon-moon);
  mask-image: var(--cdme-icon-moon);
}

[data-theme='dark'] .icon-mask {
  -webkit-mask-image: var(--cdme-icon-sun);
  mask-image: var(--cdme-icon-sun);
}
</style>
