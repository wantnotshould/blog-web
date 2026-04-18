import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false, title: 'Login' },
    },
    {
      path: '/',
      component: () => import('@/layout/Layout.vue'),
      children: [
        {
          path: '/',
          name: 'index',
          component: () => import('@/views/Index.vue'),
          meta: { title: 'home', requiresAuth: true },
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/blog/Index.vue'),
          meta: { title: 'Blog', requiresAuth: true },
        },

        {
          path: '/404',
          name: 'not-found',
          component: () => import('@/views/pages/NotFound.vue'),
          meta: { title: 'Not Found' },
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

export default router
