export async function sendTelegram(message: string) {
  const config = useRuntimeConfig()
  const token = config.telegramBotToken
  const chatId = config.telegramChatId
  if (!token || !chatId) return

  try {
    await $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }
    })
  } catch (e: any) {
    console.error('[Telegram] gagal kirim:', e.message)
  }
}
