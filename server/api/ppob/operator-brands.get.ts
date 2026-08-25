import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const category = query.category as string || 'Pulsa'

  return getCached(`ppob:operator-brands:${category}`, async () => {
    const res = await $fetch<any>(config.hasuraGraphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
      body: { query: `query {
        ppob_operator_brands(
          where: { is_active: { _eq: true }, category: { _eq: "${category}" } }
          order_by: { sort_order: asc }
        ) { id name slug logo_url banner_url category sku_keyword badge_text sort_order }
      }` }
    })
    return res.data?.ppob_operator_brands ?? []
  })
})
