<template>
  <PpobLayout>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 20px 32px">
      <div style="max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:16px">
        <div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">📱</div>
        <div>
          <h1 style="font-size:24px;font-weight:900;color:white;margin:0;letter-spacing:-0.5px">Pulsa & Paket Data</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0">Semua operator tersedia, proses instan</p>
        </div>
      </div>
    </div>

    <div style="max-width:1280px;margin:0 auto;padding:32px 20px 80px">

      <!-- STEP 1: Pilih Operator (jika belum pilih) -->
      <div v-if="!selectedOperator">


        <!-- Loading -->
        <div v-if="loadingOps" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
          <div v-for="i in 6" :key="i"
            style="height:140px;border-radius:20px;background:#e2e8f0;animation:skeleton 1.5s ease infinite"></div>
        </div>

        <!-- Grid operator -->
        <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
          <button v-for="op in operators" :key="op.id"
            @click="pilihOperator(op)"
            class="ppob-op-card"
            style="position:relative;border-radius:20px;overflow:hidden;border:none;cursor:pointer;display:flex;flex-direction:column;background:#1a1a2e;box-shadow:0 4px 16px rgba(0,0,0,0.12);transition:all 0.3s ease;aspect-ratio:2/3">

            <!-- Cover image area -->
            <div style="position:relative;flex:1;overflow:hidden;min-height:0">
              <!-- Banner jika ada -->
              <img v-if="op.banner_url" :src="op.banner_url" :alt="op.name"
                class="op-logo"
                style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s ease">
              <!-- Logo di tengah jika tidak ada banner -->
              <div v-else
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e293b,#0f172a);padding:20px">
                <img v-if="op.logo_url" :src="op.logo_url" :alt="op.name"
                  class="op-logo"
                  style="max-width:100px;max-height:70px;object-fit:contain;transition:transform 0.4s ease">
                <span v-else style="font-size:48px">📱</span>
              </div>

              <!-- Badge -->
              <div v-if="op.badge_text"
                style="position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:800;background:#f59e0b;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
                {{ op.badge_text }}
              </div>

              <!-- Hover overlay -->
              <div class="op-hover"
                style="position:absolute;inset:0;background:rgba(99,102,241,0.82);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s ease;gap:8px">
                <div style="font-size:40px;filter:drop-shadow(0 2px 12px rgba(0,0,0,0.4))">⚡</div>
                <div style="font-size:18px;font-weight:900;color:white;letter-spacing:3px;text-transform:uppercase;text-shadow:0 2px 8px rgba(0,0,0,0.4)">Top Up</div>
              </div>
            </div>

            <!-- Info solid bottom -->
            <div style="background:#1a1a2e;padding:12px 14px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0">
              <div style="font-size:13px;font-weight:800;color:white;line-height:1.3;margin-bottom:3px">{{ op.name }}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.4);font-weight:600">{{ getProductCount(op) }} produk</div>
            </div>
          </button>
        </div>

        <!-- Trust badges -->
        <div style="margin-top:40px;background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;display:flex;flex-wrap:wrap;gap:24px;justify-content:center">
          <div v-for="t in trustBadges" :key="t.label" style="display:flex;align-items:center;gap:10px">
            <div style="font-size:24px">{{ t.icon }}</div>
            <div>
              <div style="font-size:13px;font-weight:700;color:#1a202c">{{ t.label }}</div>
              <div style="font-size:12px;color:#64748b">{{ t.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 2: Form setelah pilih operator -->
      <div v-else>
        <div style="display:grid;gap:24px" :style="isDesktop ? 'grid-template-columns:1fr 340px' : 'grid-template-columns:1fr'">

          <!-- KIRI -->
          <div style="display:flex;flex-direction:column;gap:16px">

            <!-- Operator terpilih -->
            <div style="background:linear-gradient(135deg,#f0fdfa,#ccfbf1);border:1.5px solid #99f6e4;border-radius:20px;padding:16px;display:flex;align-items:center;gap:14px">
              <div style="width:56px;height:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <img v-if="selectedOperator.logo_url" :src="selectedOperator.logo_url"
                  style="max-width:56px;max-height:38px;object-fit:contain">
                <span v-else style="font-size:24px">📱</span>
              </div>
              <div style="flex:1">
                <div style="font-size:15px;font-weight:800;color:#1a202c">{{ selectedOperator.name }}</div>
                <div style="font-size:12px;color:#0d9488">{{ filteredProducts.length }} produk tersedia</div>
              </div>
              <button @click="gantiOperator"
                style="padding:8px 14px;border-radius:10px;background:white;color:#0d9488;border:1.5px solid #99f6e4;font-size:12px;font-weight:700;cursor:pointer">
                Ganti
              </button>
            </div>

            <!-- Nomor HP -->
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;background:#0d9488;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0">1</div>
                <div style="font-size:15px;font-weight:800;color:#1a202c">Nomor HP</div>
              </div>
              <input v-model="phoneNo" type="tel" inputmode="numeric" placeholder="08xxxxxxxxxx"
                style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s;font-family:monospace;letter-spacing:1px"
                @focus="$event.target.style.borderColor='#0d9488';$event.target.style.background='white'"
                @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
                <div v-if="savedNumbers.length" style="display:flex;flex-wrap:wrap;gap:6px">
                  <button v-for="num in savedNumbers" :key="num" @click="phoneNo=num"
                    style="padding:4px 12px;background:#f0fdfa;color:#0d9488;border:1px solid #99f6e4;border-radius:100px;font-size:11px;font-weight:700;cursor:pointer;font-family:monospace">
                    {{ num }}
                  </button>
                </div>
                <div v-else style="font-size:12px;color:#94a3b8">Nomor yang akan diisi pulsa/data</div>
                <button v-if="phoneNo && !savedNumbers.includes(phoneNo)" @click="saveNumber"
                  style="font-size:12px;color:#0d9488;background:none;border:none;cursor:pointer;font-weight:600;padding:0;flex-shrink:0">💾 Simpan</button>
                <button v-else-if="phoneNo && savedNumbers.includes(phoneNo)" @click="removeNumber(phoneNo)"
                  style="font-size:12px;color:#dc2626;background:none;border:none;cursor:pointer;font-weight:600;padding:0;flex-shrink:0">🗑 Hapus</button>
              </div>
            </div>

            <!-- Tab & Produk -->
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0"
                  :style="phoneNo ? 'background:#0d9488;color:white' : 'background:#e2e8f0;color:#94a3b8'">2</div>
                <div style="font-size:15px;font-weight:800;" :style="phoneNo ? 'color:#1a202c' : 'color:#94a3b8'">Pilih Produk</div>
              </div>

              <div v-if="!phoneNo" style="text-align:center;padding:24px;color:#94a3b8;font-size:14px">
                Masukkan nomor HP terlebih dahulu
              </div>
              <template v-else>
                <!-- Tab -->
                <div style="display:flex;gap:0;margin-bottom:16px;background:#f1f5f9;padding:4px;border-radius:12px">
                  <button @click="activeTab='Pulsa'"
                    style="flex:1;padding:8px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all 0.15s"
                    :style="activeTab==='Pulsa' ? 'background:white;color:#0d9488;box-shadow:0 2px 4px rgba(0,0,0,0.08)' : 'background:transparent;color:#64748b'">
                    📞 Pulsa
                  </button>
                  <button @click="activeTab='Data'"
                    style="flex:1;padding:8px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all 0.15s"
                    :style="activeTab==='Data' ? 'background:white;color:#0d9488;box-shadow:0 2px 4px rgba(0,0,0,0.08)' : 'background:transparent;color:#64748b'">
                    📶 Paket Data
                  </button>
                </div>

                <!-- Featured produk -->
                <div v-if="featuredProducts.length > 0">
                  <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.5px;margin-bottom:10px">REKOMENDASI</div>
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:16px">
                    <button v-for="p in featuredProducts" :key="p.buyer_sku_code"
                      @click="selectedProduct=p"
                      style="padding:14px 12px;border-radius:14px;text-align:left;cursor:pointer;border:1.5px solid;transition:all 0.15s;background:white;position:relative"
                      :style="selectedProduct?.buyer_sku_code===p.buyer_sku_code
                        ? 'border-color:#0d9488;background:#f0fdfa;box-shadow:0 0 0 3px rgba(13,148,136,0.12)'
                        : 'border-color:#e2e8f0'">
                      <div v-if="p.badge_text"
                        style="position:absolute;top:-1px;right:-1px;padding:2px 8px;border-radius:0 14px 0 8px;font-size:10px;font-weight:800;background:#f59e0b;color:white">
                        {{ p.badge_text }}
                      </div>
                      <div style="font-size:12px;font-weight:700;color:#1a202c;margin-bottom:4px;line-height:1.4">{{ cleanName(p.product_name) }}</div>
                      <div style="font-size:14px;font-weight:900;color:#0d9488">{{ fmtRp(p.price) }}</div>
                    </button>
                  </div>
                </div>

                <!-- Semua produk -->
                <div>
                  <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.5px;margin-bottom:10px">
                    {{ featuredProducts.length > 0 ? 'SEMUA PRODUK' : 'PILIH NOMINAL' }}
                  </div>
                  <div v-if="filteredProducts.length === 0" style="text-align:center;padding:20px;color:#94a3b8;font-size:14px">
                    Tidak ada produk {{ activeTab }} untuk {{ selectedOperator.name }}
                  </div>
                  <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px">
                    <button v-for="p in filteredProducts" :key="p.buyer_sku_code"
                      @click="selectedProduct=p"
                      style="padding:12px 10px;border-radius:12px;text-align:left;cursor:pointer;border:1.5px solid;transition:all 0.15s;background:white"
                      :style="selectedProduct?.buyer_sku_code===p.buyer_sku_code
                        ? 'border-color:#0d9488;background:#f0fdfa'
                        : 'border-color:#e2e8f0'">
                      <div style="font-size:11px;font-weight:700;color:#1a202c;margin-bottom:3px;line-height:1.4">{{ cleanName(p.product_name) }}</div>
                      <div style="font-size:13px;font-weight:900;color:#0d9488">{{ fmtRp(p.price) }}</div>
                    </button>
                  </div>
                </div>
              </template>
            </div>

            <!-- Email -->
            <div v-if="selectedProduct" style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <div style="width:28px;height:28px;border-radius:50%;background:#0d9488;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0">3</div>
                <div style="font-size:15px;font-weight:800;color:#1a202c">Email Konfirmasi</div>
              </div>
              <input v-model="buyerEmail" type="email" placeholder="email@anda.com"
                style="width:100%;box-sizing:border-box;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;outline:none;color:#1a202c;background:#f8faff;transition:border 0.2s"
                @focus="$event.target.style.borderColor='#0d9488';$event.target.style.background='white';emailConfirmed=false"
                @blur="$event.target.style.borderColor='#e2e8f0';$event.target.style.background='#f8faff'"/>
              <div v-if="buyerEmail.includes('@')"
                style="margin-top:12px;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px">
                <div style="font-size:12px;color:#92400e;margin-bottom:8px">⚠️ Bukti transaksi akan dikirim ke:</div>
                <div style="font-size:14px;font-weight:700;color:#1a202c;margin-bottom:10px">{{ buyerEmail }}</div>
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                  <input type="checkbox" v-model="emailConfirmed" style="width:16px;height:16px;accent-color:#0d9488">
                  <span style="font-size:13px;color:#64748b;font-weight:600">Ya, email sudah benar</span>
                </label>
              </div>
            </div>

            <!-- Tombol mobile -->
            <div v-if="selectedProduct && !isDesktop"
              style="background:white;border-radius:20px;padding:20px;border:1px solid #e2e8f0">
              <p v-if="orderError" style="color:#dc2626;font-size:13px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>
              <button @click="showConfirm=true" :disabled="!canBuy"
                style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#0d9488,#0f766e);color:white"
                :style="!canBuy ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(13,148,136,0.35)'">
                {{ ordering ? 'Memproses...' : `Bayar ${fmtRp(selectedProduct.price)} →` }}
              </button>
            </div>
          </div>

          <!-- KANAN: Sticky Summary -->
          <div v-if="isDesktop" style="position:sticky;top:130px;height:fit-content">
            <div style="background:white;border-radius:20px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
              <div style="font-size:13px;font-weight:800;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px">Ringkasan Pesanan</div>

              <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#f0fdfa;border-radius:14px;margin-bottom:20px">
                <div style="width:48px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <img v-if="selectedOperator.logo_url" :src="selectedOperator.logo_url"
                    style="max-width:48px;max-height:34px;object-fit:contain">
                  <span v-else style="font-size:24px">📱</span>
                </div>
                <div>
                  <div style="font-size:14px;font-weight:700;color:#1a202c">{{ selectedOperator.name }}</div>
                  <div style="font-size:12px;color:#64748b">{{ selectedProduct ? cleanName(selectedProduct.product_name) : 'Pilih produk' }}</div>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Nomor HP</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;font-family:monospace">{{ phoneNo || '-' }}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Produk</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;max-width:160px;text-align:right">{{ selectedProduct ? cleanName(selectedProduct.product_name) : '-' }}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="font-size:13px;color:#64748b">Email</span>
                  <span style="font-size:13px;font-weight:600;color:#1a202c;max-width:160px;text-align:right;word-break:break-all">{{ buyerEmail || '-' }}</span>
                </div>
                <div style="height:1px;background:#e2e8f0"></div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:15px;font-weight:800;color:#1a202c">Total</span>
                  <span style="font-size:22px;font-weight:900;color:#0d9488">{{ selectedProduct ? fmtRp(selectedProduct.price) : '-' }}</span>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
                <div v-for="t in ['⚡ Instan','🔒 Aman','📧 Email']" :key="t"
                  style="text-align:center;padding:8px 4px;background:#f0fdfa;border-radius:10px;font-size:11px;font-weight:700;color:#64748b">{{ t }}</div>
              </div>

              <p v-if="orderError" style="color:#dc2626;font-size:12px;text-align:center;margin:0 0 10px">⚠️ {{ orderError }}</p>
              <button @click="showConfirm=true" :disabled="!canBuy"
                style="width:100%;padding:16px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#0d9488,#0f766e);color:white"
                :style="!canBuy ? 'opacity:0.4;cursor:not-allowed' : 'box-shadow:0 4px 20px rgba(13,148,136,0.35)'">
                {{ ordering ? 'Memproses...' : 'Bayar Sekarang →' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom sticky mobile -->
    <div v-if="selectedProduct && !isDesktop"
      style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px 20px;background:rgba(255,255,255,0.98);backdrop-filter:blur(20px);border-top:1px solid #e2e8f0;z-index:50">
      <div style="display:flex;align-items:center;justify-content:space-between;max-width:600px;margin:0 auto">
        <div>
          <div style="font-size:11px;color:#64748b;font-weight:600">Total Bayar</div>
          <div style="font-size:22px;font-weight:900;color:#0d9488">{{ fmtRp(selectedProduct.price) }}</div>
        </div>
        <button @click="showConfirm=true" :disabled="!canBuy"
          style="padding:14px 28px;border:none;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#0d9488,#0f766e);color:white"
          :style="!canBuy ? 'opacity:0.4' : 'box-shadow:0 4px 16px rgba(13,148,136,0.4)'">
          Bayar →
        </button>
      </div>
    </div>

    <!-- Modal Konfirmasi -->
    <div v-if="showConfirm && selectedProduct"
      style="position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.6)"
      @click.self="showConfirm=false">
      <div style="background:white;border-radius:24px 24px 0 0;padding:28px 24px 36px;width:100%;max-width:480px;animation:slideUp 0.3s ease">
        <div style="width:40px;height:4px;background:#e2e8f0;border-radius:2px;margin:0 auto 20px"></div>
        <h3 style="font-size:18px;font-weight:800;color:#1a202c;margin:0 0 20px;text-align:center">Konfirmasi Pesanan</h3>
        <div style="background:#f8faff;border-radius:16px;padding:16px;margin-bottom:20px">
          <div v-for="row in confirmRows" :key="row.label"
            style="display:flex;justify-content:space-between;padding:8px 0"
            :style="row.last ? 'border-top:1px solid #e2e8f0;padding-top:12px;margin-top:4px' : 'border-bottom:1px solid #f1f5f9'">
            <span style="font-size:13px;color:#64748b">{{ row.label }}</span>
            <span style="font-size:13px;font-weight:700;color:#1a202c;text-align:right;max-width:60%">{{ row.value }}</span>
          </div>
        </div>
        <div style="display:flex;gap:12px">
          <button @click="showConfirm=false"
            style="flex:1;padding:14px;border-radius:12px;background:#f1f5f9;color:#64748b;border:none;font-size:14px;font-weight:700;cursor:pointer">Batal</button>
          <button @click="bayar" :disabled="ordering"
            style="flex:2;padding:14px;border-radius:12px;background:linear-gradient(135deg,#0d9488,#0f766e);color:white;border:none;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(13,148,136,0.4)">
            {{ ordering ? 'Memproses...' : 'Ya, Bayar Sekarang' }}
          </button>
        </div>
      </div>
    </div>

  </PpobLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Pulsa & Paket Data — miTRANZ' })

const loadingOps = ref(true)
const loading = ref(false)
const ordering = ref(false)
const operators = ref<any[]>([])
const selectedOperator = ref<any>(null)
const phoneNo = ref('')
const activeTab = ref('Pulsa')
const selectedProduct = ref<any>(null)
const buyerEmail = ref('')
const emailConfirmed = ref(false)
const orderError = ref('')
const showConfirm = ref(false)
const allProducts = ref<any[]>([])
const productConfigs = ref<any[]>([])
const savedNumbers = ref<string[]>([])
const isDesktop = ref(false)

const trustBadges = [
  { icon: '⚡', label: 'Proses Instan', desc: 'Dalam hitungan detik' },
  { icon: '🔒', label: 'Transaksi Aman', desc: 'Enkripsi penuh' },
  { icon: '📧', label: 'Konfirmasi Email', desc: 'Bukti langsung ke inbox' },
  { icon: '🕐', label: 'Layanan 24 Jam', desc: 'Kapan saja' },
]

// SSR fetch untuk data awal
const { data: opsData } = await useAsyncData('pulsa-operators',
  () => $fetch<any[]>('/api/ppob/operator-brands?category=Pulsa'),
  { default: () => [] }
)
const { data: pulsaProds } = await useAsyncData('pulsa-products',
  () => $fetch<any>('/api/ppob/products-pulsa'),
  { default: () => ({ products: [] }) }
)
operators.value = opsData.value ?? []
allProducts.value = pulsaProds.value?.products ?? []
loadingOps.value = false

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768
  window.addEventListener('resize', () => { isDesktop.value = window.innerWidth >= 768 })
  savedNumbers.value = JSON.parse(localStorage.getItem('pulsa_saved') || '[]')
})

async function pilihOperator(op: any) {
  selectedOperator.value = op
  selectedProduct.value = null
  // Load featured configs
  try {
    const configs = await $fetch<any[]>(`/api/ppob/product-configs?category=Pulsa`)
    productConfigs.value = configs
  } catch {}
}

function getProductCount(op: any) {
  const kw = op.sku_keyword.toUpperCase()
  return allProducts.value.filter((p: any) =>
    p.brand?.toUpperCase().includes(kw)
  ).length
}

function gantiOperator() {
  selectedOperator.value = null
  selectedProduct.value = null
  phoneNo.value = ''
  emailConfirmed.value = false
}

const filteredProducts = computed(() => {
  if (!selectedOperator.value) return []
  const kw = selectedOperator.value.sku_keyword.toUpperCase()
  return allProducts.value.filter((p: any) =>
    p.brand?.toUpperCase().includes(kw) &&
    p.category === (activeTab.value === 'Pulsa' ? 'Pulsa' : 'Data')
  )
})

const featuredProducts = computed(() => {
  const featuredSkus = productConfigs.value
    .filter(c => c.is_featured)
    .map(c => ({ sku: c.sku_code, badge: c.badge_text }))

  return filteredProducts.value
    .filter(p => featuredSkus.some(f => f.sku === p.buyer_sku_code))
    .map(p => ({
      ...p,
      badge_text: featuredSkus.find(f => f.sku === p.buyer_sku_code)?.badge || ''
    }))
})

const canBuy = computed(() =>
  selectedProduct.value && phoneNo.value && emailConfirmed.value && !ordering.value
)

const confirmRows = computed(() => [
  { label: 'Operator', value: selectedOperator.value?.name },
  { label: 'Nomor HP', value: phoneNo.value },
  { label: 'Produk', value: cleanName(selectedProduct.value?.product_name) },
  { label: 'Email', value: buyerEmail.value },
  { label: 'Total Bayar', value: fmtRp(selectedProduct.value?.price), last: true },
])

function saveNumber() {
  if (!phoneNo.value || savedNumbers.value.includes(phoneNo.value)) return
  savedNumbers.value.push(phoneNo.value)
  localStorage.setItem('pulsa_saved', JSON.stringify(savedNumbers.value))
}
function removeNumber(num: string) {
  savedNumbers.value = savedNumbers.value.filter(n => n !== num)
  localStorage.setItem('pulsa_saved', JSON.stringify(savedNumbers.value))
}

async function bayar() {
  if (!canBuy.value) return
  ordering.value = true
  orderError.value = ''
  showConfirm.value = false
  try {
    const res = await $fetch<any>('/api/ppob/order', {
      method: 'POST',
      body: {
        customer_no: phoneNo.value,
        email: buyerEmail.value,
        product: selectedProduct.value,
      }
    })
    const payUrl = res.paymentUrl || res.invoice?.payment_url
    if (payUrl) window.location.href = payUrl
    else orderError.value = res.message || 'Gagal membuat pesanan'
  } catch (e: any) {
    orderError.value = e?.data?.message || 'Terjadi kesalahan'
  } finally { ordering.value = false }
}

function cleanName(name: string) {
  if (!name) return ''
  const op = selectedOperator.value?.name || ''
  return name.replace(new RegExp(`^(${op}|Pulsa|Paket Data|Data)\\s*`, 'i'), '').trim() || name
}
function fmtRp(n: number) {
  return n ? new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(n) : '-'
}
</script>

<style>
@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
@keyframes skeleton { 0%,100% { opacity:0.5 } 50% { opacity:1 } }
.ppob-op-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.25) !important; }
.ppob-op-card:hover .op-logo { transform: scale(1.07); }
.ppob-op-card:hover .op-hover { opacity: 1 !important; }
</style>
