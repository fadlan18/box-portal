<template>
  <div style="min-height:100vh;background:#f0f4fa;font-family:'Inter',sans-serif">

    <!-- Navbar -->
    <nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;padding:0 32px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <a href="/" style="font-size:22px;font-weight:900;text-decoration:none">
          <span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span>
        </a>
        <a href="/" style="font-size:14px;color:#1a4fa0;text-decoration:none;font-weight:600">← Beranda</a>
      </div>
    </nav>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a4fa0 0%,#2563eb 100%);padding:56px 24px;text-align:center">
      <div style="max-width:600px;margin:0 auto">
        <h1 style="font-size:32px;font-weight:900;color:white;margin:0 0 12px;letter-spacing:-1px">
          Semua Layanan PPOB
        </h1>
        <p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;margin:0">
          Bayar & top up semua kebutuhan digital dalam satu platform. Proses otomatis, konfirmasi ke email.
        </p>
      </div>
    </div>

    <!-- Produk Grid -->
    <div style="max-width:1000px;margin:0 auto;padding:48px 24px">

      <!-- Loading -->
      <div v-if="loading" style="text-align:center;padding:64px">
        <div style="font-size:40px;margin-bottom:16px">⏳</div>
        <div style="color:#64748b;font-size:15px">Memuat layanan...</div>
      </div>

      <!-- Aktif -->
      <template v-else>
        <div style="margin-bottom:40px" v-if="aktif.length">
          <h2 style="font-size:16px;font-weight:700;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin:0 0 20px">
            Layanan Tersedia
          </h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
            <a v-for="cat in aktif" :key="cat.id" :href="cat.href"
              style="display:flex;flex-direction:column;align-items:center;padding:28px 16px;background:white;border:1.5px solid #e2e8f0;border-radius:20px;text-decoration:none;transition:all 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.04)"
              onmouseover="this.style.borderColor='#93c5fd';this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(26,79,160,0.12)';this.style.background='#f0f6ff'"
              onmouseout="this.style.borderColor='#e2e8f0';this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';this.style.background='white'">
              <div style="font-size:44px;margin-bottom:14px">{{ cat.icon }}</div>
              <div style="font-size:14px;font-weight:700;color:#1a202c;text-align:center;margin-bottom:6px">{{ cat.name }}</div>
              <div style="font-size:12px;color:#64748b;text-align:center;line-height:1.5">{{ cat.description }}</div>
              <div style="margin-top:14px;padding:6px 16px;background:#eff6ff;color:#1a4fa0;border-radius:100px;font-size:12px;font-weight:700">
                Pilih →
              </div>
            </a>
          </div>
        </div>

        <!-- Segera Hadir -->
        <div v-if="segera.length">
          <h2 style="font-size:16px;font-weight:700;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin:0 0 20px">
            Segera Hadir
          </h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
            <div v-for="cat in segera" :key="cat.id"
              style="display:flex;flex-direction:column;align-items:center;padding:28px 16px;background:white;border:1.5px dashed #e2e8f0;border-radius:20px;opacity:0.6">
              <div style="font-size:44px;margin-bottom:14px;filter:grayscale(1)">{{ cat.icon }}</div>
              <div style="font-size:14px;font-weight:700;color:#94a3b8;text-align:center;margin-bottom:6px">{{ cat.name }}</div>
              <div style="font-size:12px;color:#cbd5e1;text-align:center">{{ cat.description }}</div>
              <div style="margin-top:14px;padding:6px 16px;background:#f1f5f9;color:#94a3b8;border-radius:100px;font-size:12px;font-weight:700">
                Segera Hadir
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div style="background:linear-gradient(135deg,#1a4fa0,#2563eb);border-radius:20px;padding:36px;text-align:center;margin-top:40px">
          <div style="font-size:32px;margin-bottom:12px">📧</div>
          <h3 style="font-size:17px;font-weight:800;color:white;margin:0 0 8px">Konfirmasi Langsung ke Email</h3>
          <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 20px;line-height:1.7">
            Setiap transaksi berhasil, token & bukti pembayaran dikirim otomatis ke email Anda dalam hitungan detik.
          </p>
          <a href="/ppob/riwayat" style="display:inline-block;padding:10px 24px;background:white;color:#1a4fa0;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700">
            📋 Cek Riwayat Transaksi
          </a>
        </div>
      </template>
    </div>

    <div style="text-align:center;padding:32px;color:#94a3b8;font-size:13px">
      © 2026 miTRANZ. Platform Layanan Digital Terpercaya.
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Semua Layanan PPOB — miTRANZ' })

const loading = ref(true)
const categories = ref<any[]>([])

onMounted(async () => {
  try {
    categories.value = await $fetch('/api/ppob/categories')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const aktif = computed(() =>
  categories.value.filter(c => c.is_active !== false)
)
const segera = computed(() =>
  categories.value.filter(c => c.is_active === false)
)
</script>
