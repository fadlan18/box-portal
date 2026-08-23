export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const appUrl = config.public.appUrl || 'https://mitranz.com'
  const res = await $fetch(`https://api.telegram.org/bot${config.telegramBotToken}/setWebhook`, {
    method: 'POST',
    body: { url: appUrl + '/api/chat/webhook', allowed_updates: ['message', 'callback_query'] }
  })
  return res
})
