<template>
  <PpobLayout>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 20px 32px">
      <div style="max-width:680px;margin:0 auto;display:flex;align-items:center;gap:16px">
        <div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">📋</div>
        <div>
          <h1 style="font-size:24px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">Riwayat Transaksi</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0">Verifikasi email untuk melihat riwayat</p>
        </div>
      </div>
    </div>

    <div style="max-width:680px;margin:0 auto;padding:32px 20px 60px">

      <!-- Step 1: Input Email -->
      <div v-if="step === 1"
        style="background:white;border-radius:20px;padding:32px;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.06)">
        <div style="text-align:center;margin-bottom:28px">
          <div style="font-size:48px;margin-bottom:12px">📧</div>
          <h2 style="font-size:18px;font-weight:800;color:#1a202c;margin:0 0 6px">Masukkan Email Anda</h2>
          <p style="font-size:13px;color:#64748b;margin:0">Gunakan email yang sama saat melakukan transaksi</p>
        </div>

        <div style="margin-bottom:16px">
          <input v-model="emailInput" type="email" placeholder="email@anda.com"
            style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s"
            @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white'"
            @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"
            @keyup.enter="kirimOTP"/>
        </div>

        <p v-if="errorMsg" style="color:#dc2626;font-size:13px;margin:0 0 12px;text-align:center">⚠️ {{ errorMsg }}</p>

        <button @click="kirimOTP" :disabled="loading || !emailInput"
          style="width:100%;padding:15px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;color:white;background:linear-gradient(135deg,#6366f1,#4f46e5);transition:all 0.2s"
          :style="(loading || !emailInput) ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(99,102,241,0.35)'">
          {{ loading ? 'Mengirim...' : 'Kirim Kode Verifikasi →' }}
        </button>
      </div>

      <!-- Step 2: Input OTP -->
      <div v-else-if="step === 2"
        style="background:white;border-radius:20px;padding:32px;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.06)">
        <div style="text-align:center;margin-bottom:28px">
          <div style="font-size:48px;margin-bottom:12px">🔐</div>
          <h2 style="font-size:18px;font-weight:800;color:#1a202c;margin:0 0 6px">Masukkan Kode Verifikasi</h2>
          <p style="font-size:13px;color:#64748b;margin:0">Kode 6 digit dikirim ke <strong>{{ emailInput }}</strong></p>
        </div>

        <div style="margin-bottom:16px">
          <input v-model="otpInput" type="text" placeholder="000000" maxlength="6"
            style="width:100%;box-sizing:border-box;padding:16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:28px;font-weight:800;text-align:center;outline:none;letter-spacing:10px;color:#1a202c;background:#f8faff;transition:border 0.2s"
            @focus="$event.target.style.borderColor='#6366f1';$event.target.style.background='white'"
            @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"
            @keyup.enter="verifyOTP"/>
        </div>

        <p v-if="errorMsg" style="color:#dc2626;font-size:13px;margin:0 0 12px;text-align:center">⚠️ {{ errorMsg }}</p>

        <button @click="verifyOTP" :disabled="loading || otpInput.length < 6"
          style="width:100%;padding:15px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;color:white;background:linear-gradient(135deg,#6366f1,#4f46e5);margin-bottom:12px"
          :style="(loading || otpInput.length < 6) ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(99,102,241,0.35)'">
          {{ loading ? 'Memverifikasi...' : 'Verifikasi →' }}
        </button>

        <button @click="step=1;errorMsg='';otpInput=''"
          style="width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;color:#64748b;background:#f1f5f9">
          ← Ganti Email
        </button>

        <!-- Countdown resend -->
        <div style="text-align:center;margin-top:12px;font-size:13px;color:#94a3b8">
          <span v-if="countdown > 0">Kirim ulang dalam {{ countdown }}s</span>
          <button v-else @click="kirimOTP"
            style="background:none;border:none;color:#6366f1;font-size:13px;font-weight:600;cursor:pointer;padding:0">
            Kirim ulang kode
          </button>
        </div>
      </div>

      <!-- Step 3: Daftar Transaksi -->
      <div v-else-if="step === 3">

        <!-- Info email -->
        <div style="background:white;border-radius:16px;padding:16px;border:1px solid #e2e8f0;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:50%;background:#f5f3ff;display:flex;align-items:center;justify-content:center;font-size:16px">👤</div>
            <div>
              <div style="font-size:13px;font-weight:700;color:#1a202c">{{ emailInput }}</div>
              <div style="font-size:11px;color:#64748b">{{ transactions.length }} transaksi ditemukan</div>
            </div>
          </div>
          <button @click="step=1;transactions=[];sessionToken='';emailInput=''"
            style="padding:6px 14px;border-radius:8px;background:#f1f5f9;color:#64748b;border:none;font-size:12px;font-weight:600;cursor:pointer">
            Keluar
          </button>
        </div>

        <!-- Kosong -->
        <div v-if="transactions.length === 0"
          style="background:white;border-radius:20px;padding:48px 24px;border:1px solid #e2e8f0;text-align:center">
          <div style="font-size:48px;margin-bottom:12px">📭</div>
          <div style="font-size:16px;font-weight:700;color:#1a202c;margin-bottom:6px">Belum ada transaksi</div>
          <div style="font-size:13px;color:#64748b">Transaksi yang Anda lakukan akan muncul di sini</div>
          <a href="/ppob/games" style="display:inline-block;margin-top:20px;padding:12px 24px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700">
            Mulai Top Up →
          </a>
        </div>

        <!-- List transaksi -->
        <div v-else style="display:flex;flex-direction:column;gap:12px">
          <div v-for="tx in transactions" :key="tx.id"
            style="background:white;border-radius:16px;padding:16px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">

              <!-- Kiri: Info transaksi -->
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
                  <!-- Status badge -->
                  <span style="padding:3px 10px;border-radius:100px;font-size:11px;font-weight:800"
                    :style="getStatusStyle(tx.status)">
                    {{ getStatusLabel(tx.status) }}
                  </span>
                  <!-- Kategori -->
                  <span style="padding:2px 8px;border-radius:100px;font-size:11px;font-weight:600;background:#f1f5f9;color:#64748b">
                    {{ tx.category }}
                  </span>
                </div>

                <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:4px;line-height:1.4">
                  {{ tx.product_name }}
                </div>

                <div style="font-size:12px;color:#64748b;margin-bottom:4px">
                  📱 {{ tx.customer_no }}
                </div>

                <!-- SN jika ada -->
                <div v-if="tx.sn"
                  style="font-size:12px;font-family:monospace;color:#1a4fa0;background:#eff6ff;padding:4px 8px;border-radius:6px;display:inline-block;margin-bottom:4px;word-break:break-all">
                  Token: {{ tx.sn }}
                </div>

                <div style="font-size:11px;color:#94a3b8">
                  {{ formatDate(tx.created_at) }}
                </div>
              </div>

              <!-- Kanan: Harga -->
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:16px;font-weight:900;color:#1a202c">{{ fmtRp(tx.price) }}</div>
                <div v-if="tx.ref_id" style="font-size:10px;color:#94a3b8;font-family:monospace;margin-top:2px">
                  #{{ tx.ref_id?.slice(-8) }}
                </div>
              </div>
            </div>

            <!-- Pesan error jika gagal -->
            <div v-if="tx.message && tx.status !== 'Sukses'"
              style="margin-top:10px;padding:8px 12px;background:#fef2f2;border-radius:8px;font-size:12px;color:#dc2626">
              {{ tx.message }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </PpobLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Riwayat Transaksi — miTRANZ' })

const step = ref(1)
const emailInput = ref('')
const otpInput = ref('')
const errorMsg = ref('')
const loading = ref(false)
const sessionToken = ref('')
const transactions = ref<any[]>([])
const countdown = ref(0)

let countdownTimer: any = null

function startCountdown() {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(countdownTimer)
  }, 1000)
}

async function kirimOTP() {
  if (!emailInput.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/ppob/otp-send', {
      method: 'POST',
      body: { email: emailInput.value }
    })
    step.value = 2
    startCountdown()
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal mengirim kode'
  } finally { loading.value = false }
}

async function verifyOTP() {
  if (otpInput.value.length < 6) return
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch<any>('/api/ppob/otp-verify', {
      method: 'POST',
      body: { email: emailInput.value, otp: otpInput.value }
    })
    sessionToken.value = res.session_token
    await loadTransactions()
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Kode tidak valid'
  } finally { loading.value = false }
}

async function loadTransactions() {
  loading.value = true
  try {
    const res = await $fetch<any>(`/api/ppob/riwayat?session_token=${sessionToken.value}`)
    transactions.value = res.transactions ?? []
    step.value = 3
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal memuat riwayat'
  } finally { loading.value = false }
}

function getStatusStyle(status: string) {
  const map: Record<string, string> = {
    'Sukses': 'background:rgba(34,197,94,0.12);color:#16a34a',
    'Pending': 'background:rgba(251,191,36,0.12);color:#d97706',
    'Gagal': 'background:rgba(239,68,68,0.12);color:#dc2626',
  }
  return map[status] || 'background:rgba(100,116,139,0.12);color:#64748b'
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    'Sukses': '✓ Sukses',
    'Pending': '⏳ Pending',
    'Gagal': '✗ Gagal',
  }
  return map[status] || status
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function fmtRp(n: number) {
  return n ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n) : '-'
}
</script>
