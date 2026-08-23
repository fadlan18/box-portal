export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth') || to.path.startsWith('/api')) return

  const { status, fetchUser } = useCustomAuth()

  // Selalu fetchUser jika status loading (hard refresh)
  if (status.value !== 'authenticated') {
    await fetchUser()
  }

  if (status.value === 'unauthenticated') {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
  }
})
