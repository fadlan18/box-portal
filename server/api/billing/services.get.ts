export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const user_id = query.user_id as string

  if (!user_id) throw createError({ statusCode: 400, message: 'user_id required' })

  const data: any = await $fetch(`${config.billingUrl}/api/services/client/${user_id}`, {
    headers: { 'x-api-key': config.billingApiKey },
  }).catch(() => ({ services: [] }))

  return { ok: true, services: data.services || [] }
})
