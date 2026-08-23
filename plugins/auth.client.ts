export default defineNuxtPlugin(async () => {
  const { fetchUser, status } = useCustomAuth()
  if (status.value === 'loading') {
    await fetchUser()
  }
})
