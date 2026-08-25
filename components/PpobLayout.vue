<template>
  <div style="min-height:100vh;background:#f8faff;font-family:'Inter',sans-serif">

    <!-- Navbar -->
    <nav style="position:sticky;top:0;z-index:100;background:white;border-bottom:1px solid #e2e8f0;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
      <div style="max-width:1280px;margin:0 auto;padding:0 20px">

        <!-- Row 1: Logo + Auth -->
        <div style="display:flex;align-items:center;justify-content:space-between;height:56px">
          <a href="/" style="font-size:20px;font-weight:900;text-decoration:none;flex-shrink:0">
            <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
          </a>

          <div style="display:flex;align-items:center;gap:8px">
            <a href="/ppob/riwayat"
              style="font-size:13px;color:#64748b;text-decoration:none;font-weight:600;padding:6px 12px;border-radius:8px;border:1px solid #e2e8f0">
              📋 Riwayat
            </a>
            <a href="/auth/login"
              style="font-size:13px;color:#1a4fa0;text-decoration:none;font-weight:700;padding:6px 14px;border-radius:8px;border:1.5px solid #1a4fa0">
              Masuk
            </a>
          </div>
        </div>

        <!-- Row 2: Kategori tabs -->
        <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:0;scrollbar-width:none;-ms-overflow-style:none">
          <a v-for="cat in categories" :key="cat.id" :href="cat.href"
            style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px 8px 0 0;text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap;transition:all 0.15s;border-bottom:2px solid transparent;flex-shrink:0"
            :style="isActive(cat.href)
              ? 'color:#1a4fa0;border-bottom-color:#1a4fa0;background:#f0f6ff'
              : 'color:#64748b;border-bottom-color:transparent'"
            @mouseover="$event.currentTarget.style.background='#f8faff'"
            @mouseout="$event.currentTarget.style.background=isActive(cat.href)?'#f0f6ff':'transparent'">
            <span style="font-size:16px">{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </a>
        </div>

      </div>
    </nav>

    <!-- Konten -->
    <slot />

    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const categories = ref<any[]>([])

onMounted(async () => {
  try {
    categories.value = await $fetch<any[]>('/api/ppob/categories')
  } catch {}
})

function isActive(href: string) {
  if (href === '/ppob/games') {
    return route.path.startsWith('/ppob/games')
  }
  return route.path === href || route.path.startsWith(href + '/')
}
</script>

<style>
nav div::-webkit-scrollbar { display: none; }
</style>
