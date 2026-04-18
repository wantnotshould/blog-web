import { useUserStore } from '@/stores/userStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false, title: '登录' },
    },
    {
      path: '/',
      component: () => import('@/layout/Layout.vue'),
      children: [
        {
          path: '/',
          name: 'index',
          component: () => import('@/views/Index.vue'),
          meta: { title: '首页', requiresAuth: true },
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/blog/Index.vue'),
          meta: { title: '博客', requiresAuth: true },
        },
        {
          path: 'blog-create',
          name: 'blog-create',
          component: () => import('@/views/blog/Create.vue'),
          meta: { title: '写文章', requiresAuth: true },
        },
        {
          path: 'blog-update/:id',
          name: 'blog-update',
          props: (route: { params: { id: number } }) => ({
            id: Number(route.params.id),
          }),
          component: () => import('@/views/blog/Update.vue'),
          meta: { title: '更新文章', requiresAuth: true },
        },
        {
          path: '/404',
          name: 'not-found',
          component: () => import('@/views/pages/NotFound.vue'),
          meta: { title: '资源不存在' },
        },
        {
          // https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html
          path: ':pathMatch(.*)*',
          redirect: '/404',
        },
      ],
    },
  ],
})

const whiteList = ['/login']

router.beforeEach(async (to, _from) => {
  if (whiteList.includes(to.path)) return true

  const userStore = useUserStore()

  if (!userStore.info && userStore.isExpired()) {
    await userStore.fetchUserInfo()
  }

  if (to.meta.requiresAuth && !userStore.info) {
    return { path: '/login', query: { r: to.fullPath } }
  }

  return true
})

export default router
