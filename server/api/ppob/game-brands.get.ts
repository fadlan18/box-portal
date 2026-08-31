import { hasuraQuery } from '~/server/utils/hasura'
import { getCached } from '~/server/utils/redis'

export default defineEventHandler(async () => {
  return getCached('ppob:game-brands:active', async () => {
    const data = await hasuraQuery(`
      query {
        ppob_game_brands(
          where: { is_active: { _eq: true } }
          order_by: { sort_order: asc }
        ) { id name slug logo_url banner_url sku_keyword badge_text sort_order }
        
        active_games: ppob_products(
          where: {
            category: { _eq: "Games" }
            is_active: { _eq: true }
            buyer_product_status: { _eq: true }
          }
        ) { brand }
      }
    `)

    const brands = data.ppob_game_brands ?? []
    const activeGames = data.active_games ?? []

    // Kumpulkan brand yang punya produk aktif
    const activeBrands = new Set(
      activeGames.map((p: any) => p.brand?.toUpperCase())
    )

    // Filter brand yang punya produk aktif
    const filtered = brands.filter((b: any) =>
      activeBrands.has(b.name?.toUpperCase()) ||
      activeBrands.has(b.sku_keyword?.toUpperCase())
    )

    return filtered
  })
})
