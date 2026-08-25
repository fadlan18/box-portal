export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { action, data } = await readBody(event)

  const mutations: Record<string, string> = {
    insert: `mutation($obj: ppob_game_brands_insert_input!) {
      insert_ppob_game_brands_one(object: $obj) { id }
    }`,
    update: `mutation($id: uuid!, $set: ppob_game_brands_set_input!) {
      update_ppob_game_brands_by_pk(pk_columns: {id: $id}, _set: $set) { id }
    }`,
    delete: `mutation($id: uuid!) {
      delete_ppob_game_brands_by_pk(id: $id) { id }
    }`
  }

  const variables = action === 'insert'
    ? { obj: data }
    : action === 'update'
    ? { id: data.id, set: { name: data.name, logo_url: data.logo_url, sku_keyword: data.sku_keyword, badge_text: data.badge_text, is_active: data.is_active, sort_order: data.sort_order, updated_at: new Date().toISOString() } }
    : { id: data.id }

  const res = await $fetch<any>(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: mutations[action], variables }
  })

  if (res.errors) throw createError({ statusCode: 400, message: res.errors[0].message })
  return { ok: true }
})
