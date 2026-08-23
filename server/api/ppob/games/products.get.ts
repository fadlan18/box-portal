import { getAllProducts, applyMarkup } from '~/server/utils/digiflazz'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const all = await getAllProducts(config.digiflazzUsername, config.digiflazzApiKey)
  const markupRes: any = await $fetch('/api/ppob/markup').catch(() => ({ markups: [] }))
  const markups = markupRes.markups || []

  // Filter hanya game brands yang relevan
  const gameBrands = ['FREE FIRE', 'MOBILE LEGENDS', 'MOBILE LEGEND', 'PUBG', 'GENSHIN', 'VALORANT', 'RAGNAROK', 'POINT BLANK']
  const filtered = all.filter((p: any) =>
    ['Games', 'Aktivasi Voucher', 'Voucher'].includes(p.category) &&
    gameBrands.some(b => p.brand?.toUpperCase().includes(b))
  )
  const withMarkup = applyMarkup(filtered, markups)

  const grouped: Record<string, any[]> = {}
  withMarkup.forEach((p: any) => {
    if (!grouped[p.brand]) grouped[p.brand] = []
    grouped[p.brand].push(p)
  })

  return { products: withMarkup, grouped, total: withMarkup.length }
})
