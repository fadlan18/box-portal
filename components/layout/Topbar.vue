<template>
  <header class="flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0"
    :style="isDark
      ? 'background:#0a0f1e;border-bottom:1px solid rgba(255,255,255,0.06)'
      : 'background:white;border-bottom:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,0.04)'">

    <!-- Mobile menu button -->
    <button class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
      :style="isDark ? 'color:#94a3b8' : 'color:#64748b'"
      @click="$emit('toggle-sidebar')">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Page title -->
    <div class="flex items-center gap-2">
      <div class="w-1 h-5 rounded-full" style="background:#1a4fa0"/>
      <span class="font-semibold text-sm" :style="isDark ? 'color:#f1f5f9' : 'color:#1a202c'">
        {{ pageTitle }}
      </span>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <!-- Status -->
      <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2)">
        <div class="w-2 h-2 rounded-full bg-green-400"/>
        <span class="text-xs font-semibold text-green-400">Live</span>
      </div>

      <!-- Theme toggle -->
      <button @click="toggleTheme"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
        :style="isDark
          ? 'background:rgba(255,255,255,0.08);color:#94a3b8;border:1px solid rgba(255,255,255,0.1)'
          : 'background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0'">
        <span>{{ isDark ? '☀️' : '🌙' }}</span>
        <span class="hidden sm:block">{{ isDark ? 'Light' : 'Dark' }}</span>
      </button>

      <!-- User email -->
      <div v-if="user" class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
        :style="isDark ? 'background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2)' : 'background:#eff6ff;border:1px solid #bfdbfe'">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style="background:#1a4fa0">
          {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <span class="text-xs font-medium" :style="isDark ? 'color:#93c5fd' : 'color:#1d4ed8'">
          {{ user.email }}
        </span>
      </div>

      <!-- Logout -->
      <button @click="logout"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
        style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2)">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span class="hidden sm:block">Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['toggle-sidebar'])
const { isDark, toggleTheme } = useTheme()
const { user, logout } = useCustomAuth()
const route = useRoute()

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard', '/services': 'Layanan Saya',
    '/orders': 'Order Baru', '/invoices': 'Invoice',
    '/tickets': 'Tiket Support', '/profile': 'Profil',
    '/admin/dashboard': 'Admin Dashboard', '/admin/chat': 'Riwayat Chat',
    '/admin/users': 'Kelola User', '/admin/products': 'Kelola Produk',
  }
  return map[route.path] || 'miTRANZ'
})
</script>
