<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-56 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-40">
      <div class="flex items-center gap-3 h-16 px-4 border-b border-gray-100">
        <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 object-contain rounded-lg" />
        <div>
          <p class="font-bold text-sm text-gray-900">CE 66</p>
          <p class="text-xs text-gray-500">Warehouse</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-4 px-2 space-y-1">
        <RouterLink to="/warehouse/scanner"
          class="sidebar-link no-underline"
          :class="{ 'active': $route.path === '/warehouse/scanner' }">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
          </svg>
          <span>{{ $t('warehouse.scanner') }}</span>
        </RouterLink>

        <RouterLink to="/warehouse/parcels"
          class="sidebar-link no-underline"
          :class="{ 'active': $route.path === '/warehouse/parcels' }">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <span>{{ $t('warehouse.parcels') }}</span>
        </RouterLink>
      </nav>

      <!-- User info -->
      <div class="border-t border-gray-100 p-3 space-y-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
            {{ userInitials }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500">Warehouse</p>
          </div>
        </div>
        <button @click="logout"
          class="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          {{ $t('nav.logout') }}
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 ml-56 flex flex-col">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
        <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
        <div class="flex items-center gap-3">
          <button @click="toggleLocale"
            class="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-primary transition-all">
            {{ currentLocale === 'ru' ? 'RU' : 'EN' }}
          </button>
        </div>
      </header>

      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'WarehouseLayout',

  computed: {
    authStore() {
      return useAuthStore()
    },
    userInitials() {
      const user = this.authStore.user
      if (!user) return 'W'
      return ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() || 'W'
    },
    userName() {
      const user = this.authStore.user
      if (!user) return 'Warehouse'
      return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Warehouse'
    },
    currentLocale() {
      return this.$i18n.locale.value || this.$i18n.locale
    },
    pageTitle() {
      return this.$route.name === 'warehouse-scanner'
        ? this.$t('warehouse.scanner')
        : this.$t('warehouse.parcels')
    }
  },

  methods: {
    logout() {
      useAuthStore().logout()
      this.$router.push('/login')
    },
    toggleLocale() {
      const newLocale = this.currentLocale === 'ru' ? 'en' : 'ru'
      if (typeof this.$i18n.locale === 'object' && this.$i18n.locale !== null && 'value' in this.$i18n.locale) {
        this.$i18n.locale.value = newLocale
      } else {
        this.$i18n.locale = newLocale
      }
      localStorage.setItem('locale', newLocale)
    }
  }
}
</script>
