import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/Layout.vue'),
      children: [
        {
          path: '/',
          name: 'whoami',
          component: () => import('@/views/About.vue'),
        },
        {
          path: 'ls',
          name: 'ls',
          props: (route: { params: { p: number } }) => ({
            p: Number(route.params.p) || 1,
          }),
          component: () => import('@/views/Posts.vue'),
        },
        {
          path: 'cat/:slug',
          name: 'cat',
          props: (route: { params: { slug: string } }) => ({
            slug: String(route.params.slug),
          }),
          component: () => import('@/views/Detail.vue'),
        },
        {
          path: '404',
          name: 'not-found',
          component: () => import('@/views/pages/NotFound.vue'),
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
