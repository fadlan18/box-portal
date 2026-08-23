<template>
  <div>
    <!-- Floating Button -->
    <div v-if="!isOpen" class="fixed bottom-6 right-6 z-50">
      <div class="absolute inset-0 rounded-full" style="animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;background:rgba(26,79,160,0.2)"/>
      <button @click="openChat"
        class="relative w-10 h-10 rounded-full flex items-center justify-center"
        style="background:rgba(255,255,255,0.18);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1.5px solid rgba(255,255,255,0.4);box-shadow:0 8px 32px rgba(26,79,160,0.3),inset 0 1px 0 rgba(255,255,255,0.5);transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)"
        @mouseenter="e => (e.currentTarget as HTMLElement).style.transform='scale(1.12) translateY(-3px)'"
        @mouseleave="e => (e.currentTarget as HTMLElement).style.transform='scale(1) translateY(0)'">
        <div class="absolute inset-1 rounded-full pointer-events-none" style="background:radial-gradient(ellipse at 35% 35%,rgba(255,255,255,0.5) 0%,rgba(26,79,160,0.15) 60%,transparent 100%)"/>
        <svg class="relative z-10 w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="rgba(26,79,160,0.85)" stroke="rgba(255,255,255,0.5)" stroke-width="0.5"/>
          <circle cx="8.5" cy="12" r="1.2" fill="white"/>
          <circle cx="12" cy="12" r="1.2" fill="white"/>
          <circle cx="15.5" cy="12" r="1.2" fill="white"/>
        </svg>
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style="background:linear-gradient(135deg,#ef4444,#dc2626)">{{ unreadCount }}</span>
      </button>
      <div class="absolute bottom-1 right-12 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold text-white pointer-events-none" style="background:rgba(15,23,42,0.85);backdrop-filter:blur(8px)">
        💬 Ada yang bisa kami bantu?
      </div>
    </div>

    <!-- Chat Window -->
    <Transition name="chat-slide">
    <div v-if="isOpen" class="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col" style="height:480px;max-height:80vh;background:white;border:1px solid #e2e8f0">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 flex-shrink-0" style="background:linear-gradient(135deg,#1a4fa0,#1e40af)">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold" style="background:rgba(255,255,255,0.2);color:white;font-size:12px">mi</div>
          <div>
            <div class="font-bold text-sm text-white">miTRANZ Support</div>
            <div class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-green-400"/><span class="text-xs" style="color:rgba(255,255,255,0.8)">Online</span></div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="started" @click="confirmEndChat" class="text-xs px-2 py-1 rounded-lg font-semibold" style="background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.2)">Akhiri</button>
          <button @click="isOpen = false" class="text-white/70 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <div v-if="!started" class="flex-1 flex flex-col items-center justify-center p-6 gap-4" style="background:#f8fafc">
        <div class="text-center mb-2"><div class="text-2xl mb-2">👋</div><div class="font-bold text-gray-800 text-base">Halo! Ada yang bisa kami bantu?</div></div>
        <div class="w-full space-y-3">
          <div>
            <label class="text-xs font-semibold text-gray-600 block mb-1">Nama Anda</label>
            <input v-model="visitorName" type="text" placeholder="Masukkan nama..." class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="border:2px solid #e2e8f0;color:#1a202c" @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'" @keyup.enter="startChat"/>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600 block mb-1">Email</label>
            <input v-model="visitorEmail" type="email" placeholder="email@example.com" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="border:2px solid #e2e8f0;color:#1a202c" @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'"/>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600 block mb-1">No HP / WhatsApp</label>
            <input v-model="visitorPhone" type="tel" placeholder="+62 812 xxxx xxxx" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="border:2px solid #e2e8f0;color:#1a202c" @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'" @keyup.enter="startChat"/>
          </div>
          <p v-if="formError" style="color:#dc2626;font-size:12px;margin:0">⚠️ {{ formError }}</p>
          <button @click="startChat" :disabled="!visitorName.trim() || !visitorEmail.trim() || !visitorPhone.trim()" class="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40" style="background:#1a4fa0;box-shadow:0 4px 16px rgba(26,79,160,0.35)">Mulai Chat →</button>
        </div>
      </div>

      <!-- Chat area -->
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <div ref="messagesEl" class="flex-1 overflow-y-auto p-4 space-y-3" style="background:#f8fafc">
          <div class="flex gap-2">
            <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style="background:#1a4fa0">S</div>
            <div class="max-w-xs"><div class="px-3 py-2 rounded-2xl rounded-tl-sm text-sm" style="background:white;border:1px solid #e2e8f0;color:#374151">Halo <strong>{{ visitorName }}</strong>! 👋 Silakan tulis pertanyaan Anda.</div></div>
          </div>
          <div v-for="(msg, i) in messages" :key="i" :class="msg.role === 'user' ? 'flex justify-end' : 'flex gap-2'">
            <div v-if="msg.role === 'admin'" class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style="background:#1a4fa0">S</div>
            <div class="max-w-xs">
              <div class="px-3 py-2 rounded-2xl text-sm" :class="msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'" :style="msg.role === 'user' ? 'background:linear-gradient(135deg,#1a4fa0,#2563eb);color:white' : 'background:white;border:1px solid #e2e8f0;color:#374151'">{{ msg.text }}</div>
              <div class="text-xs text-gray-400 mt-1" :class="msg.role === 'user' ? 'text-right mr-1' : 'ml-1'">{{ msg.role === 'user' ? 'Anda' : (msg.adminName || 'Tim miTRANZ') }}</div>
            </div>
          </div>
          <div v-if="isTyping" class="flex gap-2">
            <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style="background:#1a4fa0">S</div>
            <div class="px-3 py-2 rounded-2xl rounded-tl-sm" style="background:white;border:1px solid #e2e8f0">
              <div class="flex gap-1 items-center h-4">
                <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay:0ms"/>
                <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay:150ms"/>
                <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay:300ms"/>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-shrink-0 p-3" style="border-top:1px solid #e2e8f0;background:white">
          <div class="flex gap-2 items-end">
            <textarea v-model="inputMsg" placeholder="Tulis pesan..." rows="1" class="flex-1 px-3 py-2 rounded-xl text-sm resize-none outline-none" style="border:2px solid #e2e8f0;color:#1a202c;background:#f8fafc;max-height:80px" @focus="$event.target.style.borderColor='#1a4fa0'" @blur="$event.target.style.borderColor='#e2e8f0'" @keydown.enter.exact.prevent="sendMessage"/>
            <button @click="sendMessage" :disabled="!inputMsg.trim() || sending" class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40" style="background:linear-gradient(135deg,#1a4fa0,#f97316)">
              <svg v-if="!sending" class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
              <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            </button>
          </div>
          <div class="text-center mt-2"><span class="text-xs text-gray-400">Powered by </span><span class="text-xs font-bold" style="color:#1a4fa0">mi</span><span class="text-xs font-bold" style="color:#c0192c">TRANZ</span></div>
        </div>
      </div>
    </div>
    </Transition>

    <!-- Modal akhiri chat -->
    <div v-if="showEndConfirm" class="fixed inset-0 z-[60] flex items-end justify-end p-6" style="background:rgba(0,0,0,0.3)" @click.self="showEndConfirm = false">
      <div class="rounded-2xl p-5 w-72 shadow-2xl" style="background:white;border:1px solid #e2e8f0">
        <div class="text-center mb-4"><div class="text-3xl mb-2">👋</div><div class="font-bold text-gray-800 text-sm">Akhiri sesi chat?</div></div>
        <div class="flex gap-2">
          <button @click="showEndConfirm = false" class="flex-1 py-2 rounded-xl text-xs font-semibold border" style="color:#64748b;border-color:#e2e8f0">Batal</button>
          <button @click="endChat" class="flex-1 py-2 rounded-xl text-xs font-bold text-white" style="background:#1a4fa0">Ya, Akhiri</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const started = ref(false)
const visitorName = ref('')
const visitorEmail = ref('')
const visitorPhone = ref('')
const formError = ref('')
const inputMsg = ref('')
const sending = ref(false)
const isTyping = ref(false)
const messages = ref<any[]>([])
const unreadCount = ref(0)
const messagesEl = ref<HTMLElement>()
const showEndConfirm = ref(false)

const sessionId = ref(
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('chat_session_id') || crypto.randomUUID()
    : crypto.randomUUID()
)

let eventSource: EventSource | null = null

function openChat() {
  isOpen.value = true; unreadCount.value = 0
  if (typeof localStorage !== 'undefined' && !started.value) {
    const savedName = localStorage.getItem('chat_visitor_name')
    const savedSession = localStorage.getItem('chat_session_id')
    if (savedName && savedSession) {
      visitorName.value = savedName; sessionId.value = savedSession
      started.value = true; connectSSE()
    }
  }
}

function startChat() {
  formError.value = ''
  if (!visitorName.value.trim()) { formError.value = 'Nama wajib diisi'; return }
  if (!visitorEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail.value)) { formError.value = 'Email tidak valid'; return }
  if (!visitorPhone.value.trim() || visitorPhone.value.trim().length < 9) { formError.value = 'No HP tidak valid'; return }
  started.value = true
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('chat_visitor_name', visitorName.value)
    localStorage.setItem('chat_session_id', sessionId.value)
  }
  connectSSE()
}

function connectSSE() {
  if (eventSource) eventSource.close()
  eventSource = new EventSource('/api/chat/listen?sessionId=' + sessionId.value)
  eventSource.addEventListener('message', (e) => {
    try {
      const data = JSON.parse(e.data)
      messages.value.push(data); isTyping.value = false
      if (!isOpen.value) unreadCount.value++
      nextTick(() => scrollToBottom())
    } catch {}
  })
  let retryCount = 0
  eventSource.onerror = () => {
    eventSource?.close(); retryCount++
    setTimeout(() => { if (started.value) connectSSE() }, Math.min(1000 * retryCount, 10000))
  }
}

async function sendMessage() {
  if (!inputMsg.value.trim() || sending.value) return
  const text = inputMsg.value.trim(); inputMsg.value = ''; sending.value = true
  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })
  messages.value.push({ role: 'user', text, time: timestamp })
  nextTick(() => scrollToBottom())
  setTimeout(() => { isTyping.value = true }, 500)
  setTimeout(() => { isTyping.value = false }, 15000)
  try {
    await $fetch('/api/chat/send', { method: 'POST', body: { sessionId: sessionId.value, name: visitorName.value, email: visitorEmail.value, phone: visitorPhone.value, message: text } })
  } catch {
    try {
      await $fetch('/api/chat/send', { method: 'POST', body: { sessionId: sessionId.value, name: visitorName.value, email: visitorEmail.value, phone: visitorPhone.value, message: text } })
    } catch {
      messages.value.push({ role: 'admin', text: 'Maaf, pesan gagal terkirim. Silakan coba lagi.', time: timestamp, adminName: 'Sistem' })
      isTyping.value = false
    }
  } finally { sending.value = false }
}

function scrollToBottom() { if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight }
function confirmEndChat() { showEndConfirm.value = true }

async function endChat() {
  showEndConfirm.value = false
  try { await $fetch('/api/chat/end', { method: 'POST', body: { sessionId: sessionId.value } }) } catch {}
  messages.value = []; isTyping.value = false; started.value = false
  visitorName.value = ''; visitorEmail.value = ''; visitorPhone.value = ''
  isOpen.value = false; unreadCount.value = 0
  const newId = crypto.randomUUID(); sessionId.value = newId
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('chat_session_id'); localStorage.removeItem('chat_visitor_name')
  }
  if (eventSource) { eventSource.close(); eventSource = null }
}

onUnmounted(() => { if (eventSource) eventSource.close() })
</script>

<style scoped>
.chat-slide-enter-active, .chat-slide-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.chat-slide-enter-from, .chat-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
</style>
