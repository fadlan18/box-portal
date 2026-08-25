import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  return getCached('ppob:categories:active', async () => {
    const res = await $fetch<any>(config.hasuraGraphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
      body: { query: `query {
        ppob_categories(
          where: { is_active: { _eq: true } }
          order_by: { featured_order: asc }
        ) { id name icon href description is_active is_featured featured_order }
      }` }
    })
    return res.data?.ppob_categories ?? []
  })
})
