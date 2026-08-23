<template>
  <aside class="w-60 flex-shrink-0 flex flex-col h-screen overflow-y-auto transition-colors duration-300"
    :style="isDark
      ? 'background:#0a0f1e;border-right:1px solid rgba(255,255,255,0.08)'
      : 'background:#ffffff;border-right:1px solid #e2e8f0;box-shadow:2px 0 12px rgba(0,0,0,0.08)'">

    <!-- Logo -->
    <div class="px-5 py-4 flex-shrink-0 flex items-center justify-between"
      :style="isDark ? 'border-bottom:1px solid rgba(255,255,255,0.06)' : 'border-bottom:1px solid #e2e8f0'">
      <NuxtLink to="/dashboard" class="flex items-center" style="text-decoration:none">
        <div style="font-size:26px;font-weight:900;letter-spacing:-0.5px;line-height:1;white-space:nowrap">
          <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
        </div>
      </NuxtLink>
      <button @click="emit('close')" class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Menu Utama -->
    <div class="px-3 py-4 flex-1">
      <div class="text-[10px] font-bold uppercase tracking-widest mb-2 px-2"
        :style="isDark ? 'color:rgba(255,255,255,0.3)' : 'color:#94a3b8'">Menu Utama</div>
      <nav class="space-y-0.5">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :style="isActive(item.to)
            ? 'background:rgba(26,79,160,0.12);color:#1a4fa0'
            : isDark ? 'color:#94a3b8' : 'color:#64748b'">
          <component :is="item.icon" class="w-4 h-4 flex-shrink-0"/>
          <span class="flex-1">{{ item.label }}</span>
          <span v-if="isActive(item.to)" class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:#1a4fa0"/>
        </NuxtLink>
      </nav>
    </div>

    <!-- Admin menu -->
    <div v-if="isAdmin" class="px-3 pb-4">
      <div class="text-[10px] font-bold uppercase tracking-widest mb-2 px-2"
        :style="isDark ? 'color:rgba(255,255,255,0.3)' : 'color:#94a3b8'">Admin</div>
      <nav class="space-y-0.5">
        <NuxtLink v-for="item in adminItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :style="isActive(item.to)
            ? 'background:rgba(26,79,160,0.12);color:#1a4fa0'
            : isDark ? 'color:#94a3b8' : 'color:#64748b'">
          <component :is="item.icon" class="w-4 h-4 flex-shrink-0"/>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Kembali ke beranda -->
    <div class="px-3 pb-3 flex-shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
        :style="isDark ? 'color:rgba(255,255,255,0.3)' : 'color:#94a3b8'">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Kembali ke Beranda
      </NuxtLink>
    </div>

    <!-- User info -->
    <div class="px-3 py-3 flex-shrink-0"
      :style="isDark ? 'border-top:1px solid rgba(255,255,255,0.06)' : 'border-top:1px solid #e2e8f0'">
      <div class="flex items-center gap-3 px-2">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style="background:linear-gradient(135deg,#1a4fa0,#2563eb)">
          {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold truncate" :style="isDark ? 'color:#f1f5f9' : 'color:#1a202c'">
            {{ user?.name || 'User' }}
          </div>
          <div class="text-xs truncate" :style="isDark ? 'color:#64748b' : 'color:#94a3b8'">
            {{ user?.email }}
          </div>
        </div>
        <div class="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"/>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  LayoutDashboard, Monitor, ShoppingCart, FileText,
  MessageSquare, MessageCircle, User, Settings,
  Ticket, BarChart2, Package, Users
} from 'lucide-vue-next'

const emit = defineEmits(['close'])
const route = useRoute()
const { user, isAdmin } = useCustomAuth()
const { isDark } = useTheme()

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/services',   label: 'Layanan Saya',   icon: Monitor         },
  { to: '/orders',     label: 'Order Baru',      icon: ShoppingCart    },
  { to: '/invoices',   label: 'Invoice',         icon: FileText        },
  { to: '/ppob/riwayat', label: 'Riwayat PPOB', icon: BarChart2       },
  { to: '/tickets',    label: 'Tiket Support',   icon: MessageSquare   },
  { to: '/profile',    label: 'Profil',          icon: User            },
]

const adminItems = [
  { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  { to: '/admin/products',  label: 'Kelola Produk',   icon: Package         },
  { to: '/admin/users',     label: 'Kelola User',     icon: Users           },
  { to: '/admin/chat',      label: 'Riwayat Chat',    icon: MessageCircle   },
  { to: '/admin/markup',    label: 'Markup PPOB',     icon: Settings        },
  { to: '/admin/tickets',   label: 'Kelola Tickets',  icon: Ticket          },
]

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')
</script>
