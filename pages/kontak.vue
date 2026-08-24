<template>
  <div style="min-height:100vh;background:#f0f4fa;font-family:'Inter',sans-serif">
    <nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid #e2e8f0;padding:0 32px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px">
        <a href="/" style="font-size:22px;font-weight:900;text-decoration:none"><span style="color:#1a4fa0">mi</span><span style="color:#c0192c">TRANZ</span></a>
        <a href="/" style="font-size:14px;color:#1a4fa0;text-decoration:none;font-weight:600">← Kembali</a>
      </div>
    </nav>

    <div style="background:linear-gradient(135deg,#1a4fa0 0%,#2563eb 100%);padding:64px 24px;text-align:center">
      <div style="max-width:600px;margin:0 auto">
        <h1 style="font-size:36px;font-weight:900;color:white;margin:0 0 16px;letter-spacing:-1px">Hubungi Kami</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:17px;line-height:1.7;margin:0">Ada pertanyaan atau butuh bantuan? Kami siap membantu Anda.</p>
      </div>
    </div>

    <div style="max-width:900px;margin:0 auto;padding:56px 24px">

      <!-- Info kontak -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-bottom:32px">
        <div style="background:white;border-radius:20px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);text-align:center">
          <div style="font-size:40px;margin-bottom:16px">📧</div>
          <div style="font-size:15px;font-weight:700;color:#1a202c;margin-bottom:8px">Email</div>
          <a href="mailto:cs@mitranz.com" style="color:#1a4fa0;font-size:14px;text-decoration:none;font-weight:600">cs@mitranz.com</a>
          <div style="font-size:12px;color:#94a3b8;margin-top:6px">Respon dalam 1x24 jam kerja</div>
        </div>
        <div style="background:white;border-radius:20px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);text-align:center">
          <div style="font-size:40px;margin-bottom:16px">💬</div>
          <div style="font-size:15px;font-weight:700;color:#1a202c;margin-bottom:8px">Chat Langsung</div>
          <div style="color:#374151;font-size:14px;line-height:1.6">Gunakan fitur <strong>Chat</strong> di pojok kanan bawah halaman utama</div>
          <div style="font-size:12px;color:#94a3b8;margin-top:6px">Tersedia di desktop</div>
        </div>
        <div style="background:white;border-radius:20px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);text-align:center">
          <div style="font-size:40px;margin-bottom:16px">🕐</div>
          <div style="font-size:15px;font-weight:700;color:#1a202c;margin-bottom:8px">Jam Operasional CS</div>
          <div style="color:#374151;font-size:14px;line-height:1.8">
            Senin – Jumat<br>
            <strong>08.00 – 17.00 WITA</strong>
          </div>
          <div style="font-size:12px;color:#94a3b8;margin-top:6px">Transaksi PPOB otomatis 24 jam</div>
        </div>
      </div>

      <!-- Kirim pesan -->
      <div style="background:white;border-radius:20px;padding:48px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:24px">
        <h2 style="font-size:20px;font-weight:800;color:#1a202c;margin:0 0 8px">Kirim Pesan</h2>
        <p style="color:#64748b;font-size:14px;margin:0 0 28px">Isi form di bawah dan kami akan merespons melalui email Anda.</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:16px">
          <div>
            <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Nama Lengkap</label>
            <input v-model="form.nama" type="text" placeholder="Nama Anda"
              style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;transition:border 0.2s"
              onfocus="this.style.borderColor='#1a4fa0'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
          <div>
            <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Email</label>
            <input v-model="form.email" type="email" placeholder="email@anda.com"
              style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;transition:border 0.2s"
              onfocus="this.style.borderColor='#1a4fa0'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
        </div>

        <div style="margin-bottom:16px">
          <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Subjek</label>
          <select v-model="form.subjek"
            style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;background:white">
            <option value="">Pilih subjek...</option>
            <option>Pertanyaan tentang PPOB</option>
            <option>Pertanyaan tentang Jasa Website</option>
            <option>Pengajuan Refund</option>
            <option>Laporan Masalah Transaksi</option>
            <option>Lainnya</option>
          </select>
        </div>

        <div style="margin-bottom:24px">
          <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Pesan</label>
          <textarea v-model="form.pesan" placeholder="Tuliskan pertanyaan atau kendala Anda..." rows="5"
            style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;resize:vertical;transition:border 0.2s;font-family:inherit"
            onfocus="this.style.borderColor='#1a4fa0'" onblur="this.style.borderColor='#e2e8f0'"></textarea>
        </div>

        <button @click="kirimPesan"
          style="width:100%;padding:14px;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s"
          onmouseover="this.style.opacity='0.9';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'">
          {{ terkirim ? '✅ Pesan Terkirim!' : 'Kirim Pesan →' }}
        </button>
      </div>

      <!-- FAQ singkat -->
      <div style="background:#eff6ff;border-radius:20px;padding:32px;text-align:center">
        <div style="font-size:24px;margin-bottom:12px">❓</div>
        <h3 style="font-size:16px;font-weight:700;color:#1a202c;margin:0 0 8px">Pertanyaan Umum</h3>
        <p style="color:#64748b;font-size:14px;margin:0 0 16px">Cek halaman FAQ kami untuk jawaban cepat atas pertanyaan yang sering ditanyakan.</p>
        <a href="/faq" style="display:inline-block;padding:10px 24px;background:#1a4fa0;color:white;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700">Lihat FAQ →</a>
      </div>
    </div>

    <div style="text-align:center;padding:32px;color:#94a3b8;font-size:13px">© 2026 miTRANZ. Platform Layanan Digital Terpercaya.</div>
  </div>
</template>

<script setup>
useHead({ title: 'Kontak — miTRANZ' })
const form = ref({ nama: '', email: '', subjek: '', pesan: '' })
const terkirim = ref(false)

function kirimPesan() {
  if (!form.value.nama || !form.value.email || !form.value.pesan) {
    alert('Mohon lengkapi semua field.')
    return
  }
  const subject = encodeURIComponent(`[miTRANZ] ${form.value.subjek || 'Pesan dari Website'} - ${form.value.nama}`)
  const body = encodeURIComponent(`Nama: ${form.value.nama}\nEmail: ${form.value.email}\nSubjek: ${form.value.subjek}\n\nPesan:\n${form.value.pesan}`)
  window.location.href = `mailto:cs@mitranz.com?subject=${subject}&body=${body}`
  terkirim.value = true
  setTimeout(() => { terkirim.value = false }, 4000)
}
</script>
