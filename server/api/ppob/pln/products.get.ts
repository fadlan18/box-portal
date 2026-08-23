import { getAllProducts, applyMarkup } from '~/server/utils/digiflazz'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const all = await getAllProducts(config.digiflazzUsername, config.digiflazzApiKey)
  const markupRes: any = await $fetch('/api/ppob/markup').catch(() => ({ markups: [] }))
  const filtered = all.filter((p: any) => p.category === 'PLN')
  const withMarkup = applyMarkup(filtered, markupRes.markups || [])
  return { products: withMarkup, total: withMarkup.length }
})
