<script setup lang="ts">
import TypewriterText from '@/components/TypewriterText.vue'
import router from '@/router'
import { useUIState } from '@/stores/uiStore'
import { useRoute } from 'vue-router'

useUIState()
const route = useRoute()

interface MenuItem {
  text: string
  name?: string
  path?: string
  matchNames?: string[]
  matchPaths?: string[]
  children?: MenuItem[]
}

interface MenuItemWithStatus extends MenuItem {
  selected: boolean
  children?: MenuItemWithStatus[]
}

const menus = ref<MenuItem[]>([{ text: '博客', name: 'ls', matchNames: ['ls', 'cat'] }])

const menusStatus = computed<MenuItemWithStatus[]>(() => {
  const currentName = route.name as string | undefined
  const currentPath = route.path

  const mark = (item: MenuItem): MenuItemWithStatus => {
    const nameMatched =
      (item.matchNames && currentName ? item.matchNames.includes(currentName) : false) ||
      (item.name && currentName ? item.name === currentName : false)

    const pathMatched =
      (item.matchPaths
        ? item.matchPaths.some(p => currentPath === p || currentPath.startsWith(p + '/'))
        : false) ||
      (item.path ? currentPath === item.path || currentPath.startsWith(item.path + '/') : false)

    const children = item.children?.map(mark)
    const childActive = children?.some(c => c.selected) ?? false

    const selected = nameMatched || pathMatched || childActive

    return {
      ...item,
      selected,
      children,
    }
  }

  return menus.value.map(mark)
})

const isMobile = ref(false)
const mediaQuery = window.matchMedia('(max-width: 768px)')

const update = (e: MediaQueryListEvent | MediaQueryList) => {
  isMobile.value = e.matches
}

onMounted(() => {
  update(mediaQuery)
  mediaQuery.addEventListener('change', update)
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', update)
})

const isMenuOpen = ref(false)

const openMenu = () => {
  isMenuOpen.value = true
  document.body.classList.add('menu-open')
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.classList.remove('menu-open')
}

const jump = (url?: string) => {
  if (!url) return
  router.push({ name: url })
  closeMenu()
}

const openChild = ref<string | null>(null)

const toggleChild = (name: string) => {
  openChild.value = openChild.value === name ? null : name
}

watch(
  () => route.path,
  () => {
    const activeParent = menusStatus.value.find(m => m.selected && m.children?.length)
    openChild.value = activeParent?.text ?? null
  },
  { immediate: true }
)
</script>

<template>
  <header>
    <div class="header-con">
      <!-- logo -->
      <div class="logo" @click="router.push({ name: 'whoami' })">
        <div class="logo-con">
          <span class="prompt">$</span>
          <TypewriterText text="cd me" />
          <span class="cursor">_</span>
        </div>
      </div>

      <!-- pc 菜单 -->
      <nav class="nav-desktop" v-if="!isMobile">
        <ul>
          <li v-for="item in menusStatus" :key="item.text" :class="{ selected: item.selected }">
            <div class="nav-item" @click="item.name && jump(item.name)">
              <span class="nav-text">{{ item.text }}</span>
              <div class="nav-line"></div>
            </div>

            <ul v-if="item.children?.length" class="submenu">
              <li
                v-for="child in item.children"
                :key="child.text"
                :class="{ selected: child.selected }"
              >
                <a @click="child.name && jump(child.name)">
                  {{ child.text }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- 移动端“三”图标 -->
      <div
        v-if="isMobile"
        class="cdme-icon mobile-menu"
        :class="{ active: isMenuOpen }"
        @click="isMenuOpen ? closeMenu() : openMenu()"
      />
    </div>

    <div class="overlay" :class="{ active: isMenuOpen }" @click="closeMenu" />

    <!-- 移动端 -->
    <nav class="nav-mobile" :class="{ active: isMenuOpen }">
      <!-- “X”图标 -->
      <div class="cdme-icon mobile-close" @click="closeMenu" />

      <ul class="mobile-parent-ul">
        <li v-for="item in menusStatus" :key="item.text">
          <span
            class="nav-text"
            :class="{ selected: item.selected }"
            @click="item.children?.length ? toggleChild(item.text) : item.name && jump(item.name)"
          >
            {{ item.text }}
          </span>

          <ul
            v-if="item.children?.length"
            class="mobile-submenu"
            :class="{ open: openChild === item.text }"
          >
            <li
              v-for="child in item.children"
              :key="child.text"
              :class="{ selected: child.selected }"
            >
              <div class="sub-line"></div>
              <a @click="child.name && jump(child.name)">
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
header {
  --cdme-menu-gap: 57px;
  --cdme-menu-gap-medium: 34px;

  background-color: var(--cdme-header-bg);
  position: relative;
  z-index: 99;
  width: 100%;
  display: flex;
  align-items: center;

  .header-con {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1200px;
    margin: 0 auto;
    padding: 8px 26px;

    @media (max-width: 768px) {
      padding: 8px var(--cdme-medium);
    }

    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;

      .logo-con {
        display: flex;
        align-items: center;
        font-size: 1.26rem;
        font-weight: 600;
        color: var(--cdme-text);

        .prompt {
          margin-right: 6px;
          color: var(--cdme-accent);
        }

        .cursor {
          margin-left: 6px;
          color: var(--cdme-accent);
          animation: blink 1s step-end infinite;
        }

        @keyframes typing-cd {
          from {
            max-width: 0;
          }
          to {
            max-width: 2.52rem;
          }
        }

        @keyframes typing-me {
          from {
            max-width: 0;
          }
          to {
            max-width: 2.52rem;
          }
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      }
    }

    .nav-desktop {
      margin-left: auto;

      ul {
        display: flex;
        list-style: none;
        align-items: center;
        gap: var(--cdme-menu-gap);

        @media (max-width: 1200px) {
          gap: var(--cdme-menu-gap-medium);
        }
      }

      li {
        position: relative;

        &.selected > .nav-item .nav-line {
          width: 92%;
          opacity: 1;
        }

        &.selected:hover > .nav-item .nav-line {
          width: 100%;
        }
      }

      .nav-item {
        position: relative;
        display: inline-flex;
        align-items: center;
        padding-bottom: 6px;
        cursor: pointer;

        .nav-text {
          font-size: 19px;
        }

        .nav-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          background-color: var(--cdme-accent);
          opacity: 0;
          border-radius: var(--cdme-radius);
          transition: all 0.3s ease;
        }

        &:hover .nav-line {
          width: 100%;
          opacity: 1;
        }
      }

      .submenu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        min-width: 160px;
        background: var(--cdme-bg);
        border: 1px solid var(--cdme-border);
        border-radius: var(--cdme-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 8px 0;
        z-index: 99;

        li {
          width: 100%;
          display: block;
        }

        a {
          display: block;
          padding: 10px 16px;
          font-size: 15px;
          color: var(--cdme-text);
          transition: all 0.2s ease;
          border-radius: var(--cdme-radius);

          &:hover {
            background: var(--cdme-accent);
            color: #fff;
          }
        }

        li.selected > a {
          color: var(--cdme-accent);
          background: rgba(0, 0, 0, 0.05);
        }
      }

      li:hover > .submenu {
        display: block;
      }
    }

    .mobile-menu {
      width: 24px;
      height: 24px;
      background-color: var(--cdme-text);

      -webkit-mask-image: var(--cdme-icon-menu);
      mask-image: var(--cdme-icon-menu);

      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;

      -webkit-mask-size: contain;
      mask-size: contain;

      -webkit-mask-position: center;
      mask-position: center;
    }
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  background: var(--cdme-overlay);
  transition:
    opacity 0.4s ease,
    background 0.4s ease;
  z-index: 100;

  &.active {
    opacity: 1;
    visibility: visible;
    background: var(--cdme-overlay-active);
    pointer-events: auto;
  }
}

.nav-mobile {
  position: fixed;
  top: 0;
  right: 0;
  width: 80vw;
  max-width: 340px;
  min-width: 260px;
  height: 100vh;
  background: var(--cdme-bg);
  backdrop-filter: blur(10px);
  z-index: 101;

  padding: 26px;

  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    transform: translateX(0);
  }

  .mobile-close {
    position: absolute;
    top: 6px;
    right: 16px;
    width: 24px;
    height: 24px;
    background-color: var(--cdme-text);

    -webkit-mask-image: var(--cdme-icon-close);
    mask-image: var(--cdme-icon-close);

    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;

    -webkit-mask-size: contain;
    mask-size: contain;

    -webkit-mask-position: center;
    mask-position: center;
  }

  .mobile-parent-ul {
    overflow-y: auto;
    height: 100%;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background: transparent;
    }

    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  ul {
    list-style: none;
    margin-top: 20px;
  }

  li {
    margin-bottom: 14px;
  }

  .nav-text {
    display: block;
    padding: 6px 0;
    font-size: 18px;
    border-bottom: 1px solid var(--cdme-border);
    cursor: pointer;

    &.selected {
      color: var(--cdme-accent);
    }
  }

  .mobile-submenu {
    max-height: 0;
    overflow: hidden;
    padding-left: 12px;
    transition: max-height 0.3s ease;

    &.open {
      max-height: 500px;
    }

    li {
      position: relative;
      margin-top: 6px;
    }

    .sub-line {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--cdme-border);
      border-radius: var(--cdme-radius);
    }

    li.selected .sub-line {
      background: var(--cdme-accent);
    }

    a {
      display: block;
      padding-left: 14px;
      font-size: 16px;
      color: var(--cdme-text);
    }

    li.selected a {
      color: var(--cdme-accent);
    }
  }
}
</style>
