export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'miTRANZ-JWT-Secret-2024-SuperSecure!',
    hasuraGraphqlUrl: process.env.HASURA_GRAPHQL_URL || 'http://hasura-box.box-portal.svc.cluster.local:8080/v1/graphql',
    hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET || 'vmpdfO2IZOwM1QLBFict1YJmAX3LlwX2',
    redisUrl: process.env.REDIS_URL || 'redis://:RedisBox2024!@redis-box.box-portal.svc.cluster.local:6379',
    digiflazzUsername: process.env.DIGIFLAZZ_USERNAME || 'vasozegqnwpo',
    digiflazzApiKey: process.env.DIGIFLAZZ_API_KEY || 'ee1255a9-d729-51cb-a8f3-47d5b5e5ac4b',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '8909431259:AAHvW_obBlsWZKlbIzXiO0IKEPILAXzIs3M',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '-1004397730203',
    smtpHost: process.env.SMTP_HOST || 'smtp-relay-mitranz.mitranz-mail.svc.cluster.local',
    smtpPort: process.env.SMTP_PORT || '25',
    smtpUser: process.env.SMTP_USER || 'mitranz@localdomain',
    smtpPass: process.env.SMTP_PASS || 'RelayPassMitraNZ123!',
    billingApiKey: process.env.BILLING_API_KEY || 'BILLING_mitranz_adeb67d47224938b0824721927eab42e',
    billingUrl: process.env.BILLING_URL || 'https://paymen.mitranz.com',
    billingWebhookSecret: process.env.BILLING_WEBHOOK_SECRET || '0798b667ee9d25fd542cfb5ec2d015c91e3162cfeacccfb8f5364afd1ea4708d',
    cronSecret: process.env.CRON_SECRET || 'miTRANZ-Cron-Secret-2026!',
    internalSecret: process.env.INTERNAL_SECRET || 'miTRANZ-Internal-2026!',
    webhookSecret: process.env.WEBHOOK_SECRET || '0798b667ee9d25fd542cfb5ec2d015c91e3162cfeacccfb8f5364afd1ea4708d',
    smtpFrom: process.env.SMTP_FROM || 'miTRANZ <noreply@mitranz.com>',
    public: {
      appUrl: process.env.APP_URL || 'https://mitranz.com',
    }
  },

  nitro: {
    preset: 'node-server'
  },

  app: {
    head: {
      title: 'miTRANZ — Platform Layanan Digital',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Platform layanan digital terpercaya — PPOB, Jasa Website, dan lebih banyak lagi.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: false
  }
})
