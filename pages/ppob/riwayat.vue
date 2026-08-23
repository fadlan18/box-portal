<template>
  <div style="min-height:100vh;background:#f0f4fa;padding:24px 16px">
    <div style="max-width:500px;margin:0 auto">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <a href="/" style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #e2e8f0">←</a>
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#1a202c;margin:0">Cek Riwayat Transaksi</h1>
          <p style="font-size:13px;color:#64748b;margin:0">Verifikasi email untuk lihat transaksi</p>
        </div>
      </div>

      <!-- Step 1: Input Email -->
      <div v-if="step === 1" style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0">
        <div style="margin-bottom:16px">
          <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px">Email yang digunakan saat transaksi</label>
          <input v-model="emailInput" type="email" placeholder="email@anda.com"
            style="width:100%;box-sizing:border-box;padding:12px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:14px;outline:none"
            @focus="$event.target.style.borderColor='#1a4fa0'"
            @blur="$event.target.style.borderColor='#e2e8f0'"
            @keyup.enter="kirimOTP" />
        </div>
        <p v-if="errorMsg" style="color:#dc2626;font-size:13px;margin:0 0 12px">⚠️ {{ errorMsg }}</p>
        <button @click="kirimOTP" :disabled="loading || !emailInput"
          style="width:100%;padding:13px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer"
          :style="loading ? 'opacity:0.6' : ''">
          {{ loading ? 'Mengirim...' : 'Kirim Kode Verifikasi →' }}
        </button>
      </div>

      <!-- Step 2: Input OTP -->
      <div v-else-if="step === 2" style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0">
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-size:40px;margin-bottom:8px">📧</div>
          <div style="font-weight:700;color:#1a202c">Cek Email Anda</div>
          <p style="color:#64748b;font-size:13px;margin:4px 0 0">Kode 6 digit dikirim ke <b>{{ emailInput }}</b></p>
        </div>
        <div style="margin-bottom:16px">
          <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px">Kode Verifikasi</label>
          <input v-model="otpInput" type="text" placeholder="000000" maxlength="6"
            style="width:100%;box-sizing:border-box;padding:16px;border:2px solid #e2e8f0;border-radius:12px;font-size:24px;font-weight:700;text-align:center;outline:none;letter-spacing:8px"
            @focus="$event.target.style.borderColor='#1a4fa0'"
            @blur="$event.target.style.borderColor='#e2e8f0'"
            @keyup.enter="verifyOTP" />
        </div>
        <p v-if="errorMsg" style="color:#dc2626;font-size:13px;margin:0 0 12px">⚠️ {{ errorMsg }}</p>
        <button @click="verifyOTP" :disabled="loading || otpInput.length < 6"
          style="width:100%;padding:13px;background:#1a4fa0;color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:12px"
          :style="loading ? 'opacity:0.6' : ''">
          {{ loading ? 'Memverifikasi...' : 'Verifikasi →' }}
        </button>
        <button @click="step=1;errorMsg=''" style="width:100%;padding:10px;background:transparent;color:#64748b;border:1px solid #e2e8f0;border-radius:12px;font-size:13px;cursor:pointer">
          ← Ganti Email
        </button>
        <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:12px">
          Tidak dapat kode?
          <button @click="kirimOTP" style="background:none;border:none;color:#1a4fa0;font-size:12px;cursor:pointer;font-weight:600">Kirim ulang</button>
        </p>
      </div>

      <!-- Step 3: Hasil Riwayat -->
      <div v-else-if="step === 3">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <div style="font-size:13px;color:#64748b">
            Riwayat untuk <b>{{ emailInput }}</b>
          </div>
          <button @click="step=1;transactions=[];sessionToken=''" style="font-size:12px;color:#1a4fa0;background:none;border:none;cursor:pointer;font-weight:600">
            Ganti Email
          </button>
        </div>

        <!-- Empty -->
        <div v-if="!transactions.length"
          style="background:white;border-radius:20px;padding:40px;text-align:center;border:1px solid #e2e8f0">
          <div style="font-size:40px;margin-bottom:12px">📭</div>
          <div style="font-weight:700;color:#1a202c;margin-bottom:6px">Belum ada transaksi</div>
          <p style="color:#64748b;font-size:13px">Tidak ada transaksi PPOB untuk email ini</p>
          <a href="/ppob/pln" style="display:inline-block;margin-top:16px;padding:10px 24px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600">Mulai Transaksi</a>
        </div>

        <!-- List transaksi -->
        <div v-else style="display:flex;flex-direction:column;gap:12px">
          <div v-for="trx in transactions" :key="trx.id"
            style="background:white;border-radius:16px;padding:20px;border:1px solid #e2e8f0">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
              <div>
                <div style="font-weight:700;color:#1a202c;font-size:15px">{{ trx.product_name }}</div>
                <div style="font-size:13px;color:#64748b;margin-top:2px">{{ trx.customer_no }}</div>
              </div>
              <span style="padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700;white-space:nowrap"
                :style="statusStyle(trx.status)">
                {{ trx.status }}
              </span>
            </div>

            <!-- Token -->
            <div v-if="trx.status === 'Sukses' && trx.sn"
              style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:12px;margin-bottom:12px;text-align:center">
              <div style="font-size:11px;color:#16a34a;font-weight:600;margin-bottom:4px">TOKEN</div>
              <div style="font-size:14px;font-weight:900;color:#15803d;letter-spacing:2px;word-break:break-all">{{ trx.sn }}</div>
            </div>

            <!-- Pending -->
            <div v-if="trx.status === 'Pending'"
              style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px;margin-bottom:12px">
              <div style="font-size:13px;color:#92400e">⏳ Sedang diproses, token akan dikirim ke email Anda</div>
            </div>

            <!-- Gagal -->
            <div v-if="trx.status === 'Gagal'"
              style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:10px;margin-bottom:12px">
              <div style="font-size:13px;color:#dc2626">❌ {{ trx.message || 'Transaksi gagal, hubungi admin' }}</div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="font-size:12px;color:#94a3b8">{{ fmtDate(trx.created_at) }}</div>
              <div style="font-weight:800;color:#1a4fa0;font-size:15px">{{ fmtRp(trx.price) }}</div>
            </div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:4px">Ref: {{ trx.ref_id }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Cek Riwayat Transaksi — miTRANZ' })

const step = ref(1)
const emailInput = ref('')
const otpInput = ref('')
const sessionToken = ref('')
const transactions = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref('')

async function kirimOTP() {
  if (!emailInput.value || !emailInput.value.includes('@')) return
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/ppob/otp-send', {
      method: 'POST',
      body: { email: emailInput.value }
    })
    step.value = 2
    otpInput.value = ''
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal kirim kode, coba lagi'
  } finally {
    loading.value = false
  }
}

async function verifyOTP() {
  if (otpInput.value.length < 6) return
  loading.value = true
  errorMsg.value = ''
  try {
    const res: any = await $fetch('/api/ppob/otp-verify', {
      method: 'POST',
      body: { email: emailInput.value, otp: otpInput.value }
    })
    sessionToken.value = res.session_token

    // Ambil riwayat
    const riwayat: any = await $fetch('/api/ppob/riwayat', {
      params: { session_token: res.session_token }
    })
    transactions.value = riwayat.transactions || []
    step.value = 3
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Kode salah atau expired'
  } finally {
    loading.value = false
  }
}

function statusStyle(s: string) {
  return {
    'Sukses': 'background:#d1fae5;color:#065f46',
    'Pending': 'background:#fef3c7;color:#92400e',
    'Gagal': 'background:#fee2e2;color:#991b1b',
  }[s] || 'background:#f1f5f9;color:#475569'
}

function fmtRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n||0)
}

function fmtDate(d: string) {
  return d ? new Date(d).toLocaleString('id-ID', {
    day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
  }) : '-'
}
</script>
