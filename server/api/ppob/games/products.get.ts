import { hasuraQuery } from '~/server/utils/hasura'
import { applyMarkup } from '~/server/utils/digiflazz'
import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async (event) => {
  return getCached('ppob:products:games', async () => {
    const data = await hasuraQuery(`
      query {
        ppob_products(
          where: {
            _and: [
              { is_active: { _eq: true } }
              { buyer_product_status: { _eq: true } }
              { category: { _eq: "Games" } }
            ]
          }
          order_by: { brand: asc, price: asc }
        ) {
          buyer_sku_code product_name category brand seller_name
          price price_final buyer_product_status is_active multi start_cut_off end_cut_off
        }
      }
    `)
    const products = data.ppob_products || []
    const markupRes: any = await $fetch('/api/ppob/markup').catch(() => ({ markups: [] }))
    const withMarkup = applyMarkup(products, markupRes.markups || [])

    // Deduplikasi: untuk nama produk yang sama, ambil harga terendah
    const deduped: Map<string, any> = new Map()
    withMarkup.forEach((p: any) => {
      const key = p.product_name.toLowerCase().trim()
      const existing = deduped.get(key)
      if (!existing || p.price < existing.price) {
        deduped.set(key, p)
      }
    })
    const unique = Array.from(deduped.values())

    const grouped: Record<string, any[]> = {}
    unique.forEach((p: any) => {
      const brand = p.brand || 'Lainnya'
      if (!grouped[brand]) grouped[brand] = []
      grouped[brand].push(p)
    })
    return { products: unique, grouped, total: unique.length }
  }, 900)
})
