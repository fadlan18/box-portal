export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const category = query.category as string || 'PLN'

  const res = await $fetch<any>(config.hasuraGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
    body: { query: `query {
      ppob_product_configs(
        where: { category: { _eq: "${category}" }, is_active: { _eq: true } }
        order_by: { featured_order: asc }
      ) { id category sku_code product_name badge_text is_featured featured_order }
    }` }
  })
  return res.data?.ppob_product_configs ?? []
})
