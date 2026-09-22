export const useCompanySettings = async () => {
  try {
    const data = await $fetch<any>('https://paymen.mitranz.com/api/settings/public')
    if (data?.ok && data?.settings) return data.settings
  } catch {}

  // Fallback default
  return {
    company_name: 'PT Mitra Trans Digital',
    company_phone: '0811-455-6611',
    company_email: 'cs@mitranz.com',
    company_address: 'Jl. Gunung Sinara No. 21, Ampana — Sulawesi Tengah',
    company_website: 'https://mitranz.com',
    company_tagline: 'Solusi Platform Digital Anda',
  }
}
