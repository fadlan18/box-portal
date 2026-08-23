<template>
  <div class="min-h-screen font-body relative dash-layout" :class="isDark ? 'dash-dark' : 'dash-light'">
    <div class="relative z-10 flex min-h-screen">
      <!-- Sidebar desktop -->
      <div class="hidden lg:block">
        <LayoutSidebar />
      </div>
      <!-- Konten utama -->
      <div class="flex-1 flex flex-col min-w-0">
        <LayoutTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen"/>
        <main class="flex-1 overflow-y-auto p-4 lg:p-6">
          <slot />
        </main>
      </div>
    </div>

    <!-- Mobile sidebar -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="sidebarOpen" class="lg:hidden" style="position:fixed;inset:0;z-index:9999">
          <div class="absolute inset-0 bg-black/60" @click="sidebarOpen = false"/>
          <div class="absolute left-0 top-0 h-full">
            <LayoutSidebar @close="sidebarOpen = false"/>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
const { isDark, initTheme } = useTheme()
const sidebarOpen = ref(false)
onMounted(() => initTheme())
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
