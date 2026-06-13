<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-full z-40 transition-all duration-300 flex flex-col bg-white border-r border-gray-200"
      :class="sidebarOpen ? 'w-64' : 'w-16'">

      <div class="flex items-center h-16 px-4 border-b border-gray-100">
        <RouterLink to="/admin/dashboard" class="flex items-center gap-3 no-underline min-w-0">
          <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 object-contain rounded-lg flex-shrink-0" />
          <transition name="fade">
            <span v-if="sidebarOpen" class="font-bold text-gray-900 whitespace-nowrap">CE <span class="text-primary">66</span> Admin</span>
          </transition>
        </RouterLink>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
          class="flex items-center h-10 rounded-lg transition-all duration-150 no-underline group"
          :class="[
            isActive(link.to) ? 'bg-primary-50 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            sidebarOpen ? 'px-3 gap-3' : 'px-0 justify-center'
          ]"
          :title="!sidebarOpen ? link.label : ''">
          <span class="flex-shrink-0 w-5 h-5" v-html="link.icon"></span>
          <transition name="fade">
            <span v-if="sidebarOpen" class="text-sm font-medium whitespace-nowrap">{{ link.label }}</span>
          </transition>
        </RouterLink>
      </nav>

      <!-- User + logout -->
      <div class="border-t border-gray-100 p-3">
        <div class="flex items-center gap-3 min-w-0"
          :class="sidebarOpen ? '' : 'justify-center'">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {{ userInitials }}
          </div>
          <transition name="fade">
            <div v-if="sidebarOpen" class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
              <p class="text-xs text-gray-500">Admin</p>
            </div>
          </transition>
        </div>
        <button v-if="sidebarOpen" @click="logout"
          class="mt-2 w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          {{ $t('nav.logout') }}
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col" :class="sidebarOpen ? 'ml-64' : 'ml-16'">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = !sidebarOpen"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- Language -->
          <button @click="toggleLocale"
            class="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-primary transition-all">
            {{ currentLocale === 'ru' ? 'RU' : 'EN' }}
          </button>

          <span class="text-sm text-gray-500">{{ userName }}</span>
          <button @click="logout"
            class="btn btn-ghost btn-sm text-red-500">
            {{ $t('nav.logout') }}
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'AdminLayout',

  data() {
    return {
      sidebarOpen: true
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },
    userInitials() {
      const user = this.authStore.user
      if (!user) return 'A'
      return ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() || 'A'
    },
    userName() {
      const user = this.authStore.user
      if (!user) return 'Admin'
      return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Admin'
    },
    currentLocale() {
      return this.$i18n.locale.value || this.$i18n.locale
    },
    pageTitle() {
      const routeMap = {
        'admin-dashboard': this.$t('admin.dashboard'),
        'admin-users': this.$t('admin.users'),
        'admin-shipments': this.$t('admin.shipments'),
        'admin-awb': this.$t('admin.airwaybills'),
        'admin-warehouses': this.$t('admin.warehouses'),
        'admin-tariffs': this.$t('admin.tariffs'),
        'admin-services': this.$t('admin.services'),
        'admin-reports': this.$t('admin.reports'),
        'admin-settings': this.$t('admin.settings'),
        'admin-content': this.$t('admin.content')
      }
      return routeMap[this.$route.name] || 'Admin'
    },
    navLinks() {
      const iconSize = 'width="20" height="20"'
      return [
        {
          to: '/admin/dashboard', label: this.$t('admin.dashboard'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
        },
        {
          to: '/admin/users', label: this.$t('admin.users'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
        },
        {
          to: '/admin/shipments', label: this.$t('admin.shipments'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
        },
        {
          to: '/admin/airwaybills', label: this.$t('admin.airwaybills'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
        },
        {
          to: '/admin/warehouses', label: this.$t('admin.warehouses'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`
        },
        {
          to: '/admin/tariffs', label: this.$t('admin.tariffs'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
        },
        {
          to: '/admin/services', label: this.$t('admin.services'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
        },
        {
          to: '/admin/reports', label: this.$t('admin.reports'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
        },
        {
          to: '/admin/content', label: this.$t('admin.content'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h7"/></svg>`
        },
        {
          to: '/admin/settings', label: this.$t('admin.settings'),
          icon: `<svg ${iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>`
        }
      ]
    }
  },

  methods: {
    isActive(path) {
      return this.$route.path.startsWith(path)
    },
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
  },

  mounted() {
    // Collapse sidebar on small screens
    if (window.innerWidth < 1024) {
      this.sidebarOpen = false
    }
  }
}
</script>
