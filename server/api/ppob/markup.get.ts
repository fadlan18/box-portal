import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const markups = await getCached('ppob:markup:all', async () => {
    const res: any = await $fetch(config.hasuraGraphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': config.hasuraAdminSecret },
      body: { query: `query { ppob_markup(where:{is_active:{_eq:true}}) { id category brand sku_code markup_type value is_active } }` }
    })
    return res.data?.ppob_markup || []
  })
  return { markups }
})
