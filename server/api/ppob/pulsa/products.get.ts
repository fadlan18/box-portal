import { getAllProducts, applyMarkup } from '~/server/utils/digiflazz'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const all = await getAllProducts(config.digiflazzUsername, config.digiflazzApiKey)
  const markupRes: any = await $fetch('/api/ppob/markup').catch(() => ({ markups: [] }))
  const markups = markupRes.markups || []

  const filtered = all.filter((p: any) =>
    ['Pulsa', 'Data', 'Paket SMS & Telpon', 'Masa Aktif', 'Aktivasi Perdana'].includes(p.category)
  )
  const withMarkup = applyMarkup(filtered, markups)

  const grouped: Record<string, any[]> = {}
  withMarkup.forEach((p: any) => {
    if (!grouped[p.brand]) grouped[p.brand] = []
    grouped[p.brand].push(p)
  })

  return { products: withMarkup, grouped, total: withMarkup.length }
})
