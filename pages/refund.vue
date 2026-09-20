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
        <h1 style="font-size:36px;font-weight:900;color:white;margin:0 0 16px;letter-spacing:-1px">Kebijakan Refund</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:17px;line-height:1.7;margin:0">Terakhir diperbarui: 25 Agustus 2026</p>
      </div>
    </div>

    <div style="max-width:800px;margin:0 auto;padding:56px 24px">

      <!-- Ringkasan -->
      <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid #6ee7b7;border-radius:20px;padding:32px;margin-bottom:32px;display:flex;gap:20px;align-items:flex-start">
        <div style="font-size:36px;flex-shrink:0">✅</div>
        <div>
          <h3 style="font-size:16px;font-weight:800;color:#065f46;margin:0 0 8px">Komitmen Kami</h3>
          <p style="color:#047857;font-size:14px;line-height:1.7;margin:0">
            Kepuasan klien adalah prioritas utama kami. Jika proyek website tidak dapat kami kerjakan sesuai kesepakatan, atau terjadi kesalahan dari pihak miTRANZ, kami berkomitmen untuk mengembalikan dana Anda secara penuh dan transparan.
          </p>
        </div>
      </div>

      <!-- Yang eligible -->
      <div style="background:white;border-radius:20px;padding:40px;margin-bottom:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <h2 style="font-size:19px;font-weight:800;color:#1a202c;margin:0 0 20px;display:flex;align-items:center;gap:10px">
          <span style="background:#dcfce7;color:#16a34a;width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:18px">✓</span>
          Kondisi yang Dapat Direfund
        </h2>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div v-for="item in eligible" :key="item" style="display:flex;gap:12px;align-items:flex-start;padding:16px;background:#f0fdf4;border-radius:12px">
            <span style="color:#16a34a;font-size:18px;flex-shrink:0">✓</span>
            <span style="color:#374151;font-size:14px;line-height:1.7">{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- Yang tidak eligible -->
      <div style="background:white;border-radius:20px;padding:40px;margin-bottom:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <h2 style="font-size:19px;font-weight:800;color:#1a202c;margin:0 0 20px;display:flex;align-items:center;gap:10px">
          <span style="background:#fee2e2;color:#dc2626;width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:18px">✕</span>
          Kondisi yang Tidak Dapat Direfund
        </h2>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div v-for="item in notEligible" :key="item" style="display:flex;gap:12px;align-items:flex-start;padding:16px;background:#fff7f7;border-radius:12px">
            <span style="color:#dc2626;font-size:18px;flex-shrink:0">✕</span>
            <span style="color:#374151;font-size:14px;line-height:1.7">{{ item }}</span>
          </div>
        </div>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-top:16px">
          <p style="color:#92400e;font-size:13px;line-height:1.7;margin:0">
            ⚠️ <strong>Penting:</strong> Refund hanya berlaku untuk layanan jasa website. Pastikan Anda membaca spesifikasi paket secara lengkap sebelum melakukan pembayaran. Pengajuan refund yang melewati batas waktu 7 hari kerja tidak dapat diproses.
          </p>
        </div>
      </div>

      <!-- Prosedur -->
      <div style="background:white;border-radius:20px;padding:40px;margin-bottom:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <h2 style="font-size:19px;font-weight:800;color:#1a202c;margin:0 0 24px">Prosedur Pengajuan Refund</h2>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div v-for="(step, i) in steps" :key="i" style="display:flex;gap:16px;align-items:flex-start">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0">{{ i+1 }}</div>
            <div style="padding-top:6px">
              <div style="font-size:15px;font-weight:700;color:#1a202c;margin-bottom:4px">{{ step.title }}</div>
              <div style="font-size:13px;color:#64748b;line-height:1.7">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Waktu proses -->
      <div style="background:white;border-radius:20px;padding:40px;margin-bottom:32px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <h2 style="font-size:19px;font-weight:800;color:#1a202c;margin:0 0 20px">Estimasi Waktu Pengembalian Dana</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px">
          <div v-for="t in timeline" :key="t.method" style="background:#f8faff;border-radius:12px;padding:20px;text-align:center">
            <div style="font-size:28px;margin-bottom:10px">{{ t.icon }}</div>
            <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:4px">{{ t.method }}</div>
            <div style="font-size:20px;font-weight:900;color:#1a4fa0">{{ t.days }}</div>
            <div style="font-size:12px;color:#64748b">hari kerja</div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="background:linear-gradient(135deg,#1a4fa0,#2563eb);border-radius:20px;padding:40px;text-align:center">
        <h3 style="font-size:18px;font-weight:800;color:white;margin:0 0 10px">Perlu Mengajukan Refund?</h3>
        <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 20px">Hubungi tim kami segera. Semakin cepat dilaporkan, semakin cepat diselesaikan.</p>
        <a href="/kontak" style="display:inline-block;padding:12px 28px;background:white;color:#1a4fa0;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700">Hubungi Kami →</a>
      </div>
    </div>

    <div style="text-align:center;padding:32px;color:#94a3b8;font-size:13px">© 2026 miTRANZ. Platform Layanan Digital Terpercaya.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
useHead({ title: 'Kebijakan Refund — miTRANZ | PT Mitra Trans Digital' })
const eligible = [
  'Pembayaran invoice jasa website berhasil diterima namun proyek tidak dapat dimulai dalam 7 hari kerja tanpa pemberitahuan resmi dari tim miTRANZ.',
  'Terjadi kesalahan teknis dari pihak miTRANZ yang menyebabkan layanan tidak dapat diberikan sesuai kesepakatan kontrak.',
  'Duplikasi pembayaran invoice akibat gangguan sistem (pembayaran terjadi lebih dari sekali untuk satu invoice yang sama).',
  'Proyek dibatalkan oleh pihak miTRANZ sebelum tahap pengerjaan dimulai.',
]
const notEligible = [
  'Klien berubah pikiran setelah proyek website mulai dikerjakan atau sudah memasuki tahap desain.',
  'Ketidakpuasan subjektif terhadap desain yang telah disetujui bersama pada tahap revisi.',
  'Permintaan fitur di luar spesifikasi yang telah disepakati dalam kontrak.',
  'Keterlambatan penyelesaian proyek akibat klien terlambat menyerahkan konten, aset, atau informasi yang dibutuhkan.',
  'Layanan hosting dan domain yang telah aktif dan digunakan.',
  'Paket perpanjangan hosting dan domain yang telah diproses.',
]
const steps = [
  { title: 'Hubungi kami maksimal 7 hari kerja', desc: 'Kirim email ke cs@mitranz.com atau hubungi 0811-455-6611 dengan menyebutkan nomor invoice dan alasan pengajuan refund.' },
  { title: 'Sertakan dokumen pendukung', desc: 'Lampirkan nomor invoice, bukti pembayaran, dan penjelasan lengkap mengenai alasan pengajuan refund.' },
  { title: 'Verifikasi dan evaluasi', desc: 'Tim kami akan mengevaluasi pengajuan Anda dalam 3 hari kerja dan menginformasikan keputusan via email.' },
  { title: 'Proses pengembalian dana', desc: 'Jika refund disetujui, dana dikembalikan ke rekening/metode pembayaran asal sesuai estimasi waktu yang berlaku.' },
]
const timeline = [
  { icon: '🔲', method: 'QRIS / E-Wallet', days: '3–7' },
  { icon: '🏦', method: 'Transfer Bank', days: '3–5' },
  { icon: '💳', method: 'Kartu Kredit/Debit', days: '7–14' },
]
</script>
