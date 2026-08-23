export default defineNuxtRouteMiddleware(async (to) => {
  const { status, isAdmin, fetchUser } = useCustomAuth()

  if (status.value !== 'authenticated') {
    await fetchUser()
  }

  if (status.value === 'unauthenticated') {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
  }

  if (!isAdmin.value) {
    return navigateTo('/dashboard')
  }
})
