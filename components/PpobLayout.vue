<template>
  <div style="min-height:100vh;background:#f8faff;font-family:'Inter',sans-serif">

    <!-- Navbar Row 1: identik dengan navbar utama -->
    <nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
      <div style="max-width:1280px;margin:0 auto;padding:0 24px">

        <!-- Row 1: Logo + Auth (sama persis dengan navbar utama) -->
        <div style="display:flex;align-items:center;justify-content:space-between;height:64px">
          <a href="/" style="font-size:26px;font-weight:900;letter-spacing:-0.5px;text-decoration:none;flex-shrink:0">
            <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
          </a>

          <div style="display:flex;align-items:center;gap:8px">
            <a href="/ppob/riwayat"
              style="padding:7px 14px;color:#475569;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;border:1px solid #e2e8f0;transition:all 0.2s"
              onmouseover="this.style.background='#f1f5f9'"
              onmouseout="this.style.background='transparent'">
              📋 Riwayat
            </a>
            <a href="/auth/login"
              style="padding:8px 20px;color:#1a4fa0;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;border:1.5px solid #1a4fa0;transition:all 0.2s"
              onmouseover="this.style.background='#eff6ff'"
              onmouseout="this.style.background='transparent'">
              Masuk
            </a>
            <a href="/auth/login"
              style="padding:8px 20px;background:#1a4fa0;color:white;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #1a4fa0;transition:all 0.2s"
              onmouseover="this.style.background='#1e40af'"
              onmouseout="this.style.background='#1a4fa0'">
              Daftar
            </a>
          </div>
        </div>

        <!-- Row 2: Kategori PPOB - rata tengah, subtle -->
        <div style="display:flex;justify-content:center;gap:2px;padding-bottom:0;overflow-x:auto;scrollbar-width:none">
          <a v-for="cat in categories" :key="cat.id" :href="cat.href"
            style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px 8px 0 0;text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap;transition:all 0.15s;border-bottom:2px solid transparent;flex-shrink:0"
            :style="isActive(cat.href)
              ? 'color:#1a4fa0;border-bottom-color:#1a4fa0;background:#f0f6ff'
              : 'color:#64748b;border-bottom-color:transparent;background:transparent'"
            @mouseover="($event.currentTarget as HTMLElement).style.background='#f8faff'"
            @mouseout="($event.currentTarget as HTMLElement).style.background=isActive(cat.href)?'#f0f6ff':'transparent'">
            <span style="font-size:15px">{{ cat.icon }}</span>
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
    const all = await $fetch<any[]>('/api/ppob/categories')
    categories.value = all.filter(c => c.is_active)
  } catch {}
})

function isActive(href: string) {
  if (href === '/ppob/games') return route.path.startsWith('/ppob/games')
  return route.path === href || route.path.startsWith(href + '/')
}
</script>

<style>
nav div::-webkit-scrollbar { display: none; }
</style>
