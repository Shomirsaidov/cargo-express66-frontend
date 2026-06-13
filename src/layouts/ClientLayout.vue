<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top Header -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div class="flex items-center justify-between h-14 px-4">
        <RouterLink to="/" class="flex items-center gap-2 no-underline">
          <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 object-contain rounded-lg" />
          <span class="font-bold text-base text-gray-900">CE <span class="text-primary">66</span></span>
        </RouterLink>

        <div class="flex items-center gap-2">
          <!-- Language switcher -->
          <button @click="toggleLocale"
            class="px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-primary transition-all">
            {{ currentLocale === 'ru' ? 'RU' : 'EN' }}
          </button>

          <!-- Notification bell -->
          <RouterLink to="/notifications" class="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 no-underline">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span v-if="unreadCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </RouterLink>

          <!-- User avatar -->
          <RouterLink to="/profile"
            class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm no-underline">
            {{ userInitials }}
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Main content area with bottom padding for nav -->
    <main class="flex-1 pb-20">
      <RouterView />
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 bottom-nav-safe">
      <div class="flex items-center justify-around h-16">
        <RouterLink v-for="tab in tabs" :key="tab.to" :to="tab.to"
          class="flex flex-col items-center gap-0.5 px-3 py-2 min-w-0 flex-1 no-underline"
          :class="isActiveTab(tab.to) ? 'text-primary' : 'text-gray-400'">
          <div class="relative flex flex-col items-center justify-center">
            <!-- HomeIcon -->
            <svg v-if="tab.icon === 'HomeIcon'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <!-- PackageIcon -->
            <svg v-else-if="tab.icon === 'PackageIcon'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <!-- SearchIcon -->
            <svg v-else-if="tab.icon === 'SearchIcon'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <!-- BellIcon -->
            <svg v-else-if="tab.icon === 'BellIcon'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <!-- UserIcon -->
            <svg v-else-if="tab.icon === 'UserIcon'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>

            <span v-if="tab.badge && unreadCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </div>
          <span class="text-xs font-medium truncate">{{ tab.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { useNotificationsStore } from '@/stores/notifications.js'

export default {
  name: 'ClientLayout',

  computed: {
    authStore() {
      return useAuthStore()
    },
    notifStore() {
      return useNotificationsStore()
    },
    userInitials() {
      const user = this.authStore.user
      if (!user) return 'U'
      const first = user.first_name?.[0] || ''
      const last = user.last_name?.[0] || ''
      return (first + last).toUpperCase() || 'U'
    },
    unreadCount() {
      return this.notifStore.unreadCount
    },
    currentLocale() {
      return this.$i18n.locale.value || this.$i18n.locale
    },
    tabs() {
      return [
        { to: '/dashboard', label: this.$t('admin.dashboard'), icon: 'HomeIcon' },
        { to: '/shipments', label: this.$t('nav.tracking'), icon: 'PackageIcon' },
        { to: '/tracking-numbers', label: 'Tracking', icon: 'SearchIcon' },
        { to: '/notifications', label: this.$t('nav.tracking'), icon: 'BellIcon', badge: true },
        { to: '/profile', label: this.$t('profile.title'), icon: 'UserIcon' }
      ]
    }
  },

  methods: {
    isActiveTab(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
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
    if (this.authStore.isLoggedIn) {
      this.notifStore.fetchUnreadCount()
    }
  }
}
</script>
