export default defineEventHandler(async (event) => {
  const { to } = await readBody(event)
  await $fetch('/api/email/notify', {
    method: 'POST',
    body: { type: 'reset_password', email: to, name: 'Test User', resetUrl: 'https://mitranz.com' }
  })
  return { ok: true, to }
})
