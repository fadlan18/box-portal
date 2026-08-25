export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const res = await $fetch<any>(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query {
      ppob_game_brands(
        where: { is_active: { _eq: true } }
        order_by: { sort_order: asc }
      ) { id name logo_url sku_keyword badge_text sort_order }
    }` }
  })
  return res.data?.ppob_game_brands ?? []
})
