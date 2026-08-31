import { hasuraQuery } from '~/server/utils/hasura'
import { applyMarkup } from '~/server/utils/digiflazz'
import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string || 'PLN'

  return getCached(`ppob:products:${category}`, async () => {
    const data = await hasuraQuery(`
      query GetProducts($category: String!) {
        ppob_products(
          where: {
            _and: [
              { is_active: { _eq: true } }
              { buyer_product_status: { _eq: true } }
              { category: { _eq: $category } }
            ]
          }
          order_by: { price: asc }
        ) {
          buyer_sku_code product_name category brand seller_name
          price price_final buyer_product_status is_active multi start_cut_off end_cut_off
        }
      }
    `, { category })

    const products = data.ppob_products || []
    const markupRes: any = await $fetch('/api/ppob/markup').catch(() => ({ markups: [] }))
    const withMarkup = applyMarkup(products, markupRes.markups || [])

    return { products: withMarkup, total: withMarkup.length }
  }, 900)
})
