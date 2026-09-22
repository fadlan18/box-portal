export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const res = await $fetch<any>(`${config.billingApiUrl}/api/settings/public`, {
    headers: { 'x-api-key': config.billingApiKey }
  }).catch(() => null)

  // Fallback jika billing tidak tersedia
  const defaults = {
    company_name: 'PT Mitra Trans Digital',
    company_phone: '0811-455-6611',
    company_email: 'cs@mitranz.com',
    company_address: 'Jl. Gunung Sinara No. 21, Ampana — Sulawesi Tengah',
    company_website: 'https://mitranz.com',
  }

  return { ok: true, settings: res?.settings || defaults }
})
