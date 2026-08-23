<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold" style="color:var(--dash-text-primary)">Admin Dashboard</h1>
      <p class="text-sm" style="color:var(--dash-text-muted)">Ringkasan sistem miTRANZ</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="glass p-4 rounded-2xl">
        <div class="text-2xl mb-1">{{ s.icon }}</div>
        <div class="text-2xl font-bold text-adaptive">{{ s.value }}</div>
        <div class="text-xs mt-1" style="color:var(--dash-text-muted)">{{ s.label }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'admin' })
const stats = [
  { icon: '👥', label: 'Total User', value: '—' },
  { icon: '📦', label: 'Total Order', value: '—' },
  { icon: '💬', label: 'Chat Aktif', value: '—' },
  { icon: '⚡', label: 'Transaksi PPOB', value: '—' },
]
</script>
