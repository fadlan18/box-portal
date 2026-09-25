export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { type, name, contact, desc, budget } = body

  if (!name || !contact || !desc) {
    throw createError({ statusCode: 400, message: 'Data tidak lengkap' })
  }

  // Kirim notifikasi ke Telegram admin
  const message = `🎯 *BRIEF SOLUSI CUSTOM MASUK*

📦 *Jenis Solusi:* ${type}
👤 *Nama:* ${name}
📞 *Kontak:* ${contact}
💰 *Budget:* ${budget || 'Tidak disebutkan'}

📝 *Kebutuhan:*
${desc}

---
_Segera hubungi calon klien ini!_`

  const botToken = config.telegramBotToken
  const chatId = config.telegramChatId

  if (botToken && chatId) {
    await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }
    }).catch((e) => console.error('Telegram error:', e))
  }

  return { ok: true, message: 'Brief berhasil dikirim' }
})
