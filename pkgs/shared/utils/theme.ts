import type { PiniaPluginContext } from 'pinia'

export const webUI = 'cdme_ui'
export const adminUI = 'cdme_admin_ui'

const uiStateIds = [webUI, adminUI]

export const applyTheme = (isDark: boolean) => {
  if (typeof document === 'undefined') return

  const el = document.documentElement
  el.setAttribute('data-theme', isDark ? 'dark' : 'light')
  if (isDark) {
    el.classList.add('dark')
  } else {
    el.classList.remove('dark')
  }

  document.body.classList.add('theme-loaded')
}

export function theme({ store }: PiniaPluginContext) {
  if (!uiStateIds.includes(store.$id)) return
  if (typeof window === 'undefined') return

  const initTheme = () => {
    applyTheme(store.isDark)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', e => {
      store.isDark = e.matches
      applyTheme(store.isDark)
    })
  }

  initTheme()
}
