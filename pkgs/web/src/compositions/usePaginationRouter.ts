export function usePaginationRouter() {
  const router = useRouter()
  const route = useRoute()

  const page = computed(() => {
    return Number(route.params.p) || 1
  })

  const go = (p: number) => {
    router.push({
      name: 'ls',
      params: { p: p === 1 ? undefined : p },
    })
  }

  const next = () => go(page.value + 1)
  const prev = () => go(Math.max(1, page.value - 1))

  return {
    page,
    go,
    next,
    prev,
  }
}
