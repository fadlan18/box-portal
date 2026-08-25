import { getRedis } from '~/server/utils/redis'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { action, data } = body

  let mutation = ''
  let variables: any = {}

  if (action === 'update') {
    mutation = `
      mutation Update($id: uuid!, $set: ppob_categories_set_input!) {
        update_ppob_categories_by_pk(pk_columns: {id: $id}, _set: $set) { id }
      }
    `
    variables = { id: data.id, set: {
      name: data.name,
      icon: data.icon,
      href: data.href,
      description: data.description,
      is_active: data.is_active,
      is_featured: data.is_featured,
      featured_order: data.featured_order,
      updated_at: new Date().toISOString()
    }}
  } else if (action === 'insert') {
    mutation = `
      mutation Insert($obj: ppob_categories_insert_input!) {
        insert_ppob_categories_one(object: $obj) { id }
      }
    `
    variables = { obj: data }
  } else if (action === 'delete') {
    mutation = `
      mutation Delete($id: uuid!) {
        delete_ppob_categories_by_pk(id: $id) { id }
      }
    `
    variables = { id: data.id }
  }

  const res = await $fetch<any>(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.hasuraAdminSecret
    },
    body: { query: mutation, variables }
  })

  if (res.errors) throw createError({ statusCode: 400, message: res.errors[0].message })
  // Invalidate cache
  try {
    const redis = getRedis()
    redis.del('ppob:categories:active').catch(() => {})
  } catch {}
  return { ok: true }
})
