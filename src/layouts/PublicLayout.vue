<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2 no-underline">
            <img src="@/assets/logo.png" alt="Logo" class="w-9 h-9 object-contain rounded-lg" />
            <span class="font-bold text-lg text-gray-900">Cargo Express <span class="text-primary">66</span></span>
          </RouterLink>

          <!-- Desktop Nav Links -->
          <div class="hidden lg:flex items-center gap-1">
            <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-md hover:bg-primary-50 transition-all no-underline">
              {{ link.label }}
            </RouterLink>
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-2">
            <!-- Language switcher -->
            <button @click="toggleLocale"
              class="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-lg hover:border-primary transition-all">
              <span>{{ currentLocale === 'ru' ? 'RU' : 'EN' }}</span>
            </button>

            <template v-if="!isLoggedIn">
              <RouterLink to="/login" class="btn btn-ghost btn-sm hidden sm:inline-flex no-underline text-gray-700">
                {{ $t('nav.login') }}
              </RouterLink>
              <RouterLink to="/register" class="btn btn-primary btn-sm no-underline">
                {{ $t('nav.register') }}
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink :to="dashboardPath" class="btn btn-primary btn-sm no-underline">
                {{ $t('admin.dashboard') }}
              </RouterLink>
            </template>

            <!-- Mobile menu toggle -->
            <button @click="mobileMenuOpen = !mobileMenuOpen"
              class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <transition name="slide-up">
          <div v-if="mobileMenuOpen" class="lg:hidden pb-4 border-t border-gray-100 pt-3 mt-1">
            <div class="flex flex-col gap-1">
              <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
                @click="mobileMenuOpen = false"
                class="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary rounded-lg transition-all no-underline">
                {{ link.label }}
              </RouterLink>
              <div class="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
                <button @click="toggleLocale"
                  class="flex-1 text-center py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg">
                  {{ currentLocale === 'ru' ? 'RU' : 'EN' }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 object-contain rounded-lg bg-white p-0.5" />
              <span class="font-bold text-white">Cargo Express 66</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">
              {{ $t('home.heroDesc') }}
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3 text-sm uppercase tracking-wide">{{ $t('nav.home') }}</h4>
            <ul class="space-y-2">
              <li><RouterLink to="/about" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.about') }}</RouterLink></li>
              <li><RouterLink to="/how-it-works" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.howItWorks') }}</RouterLink></li>
              <li><RouterLink to="/pricing" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.pricing') }}</RouterLink></li>
              <li><RouterLink to="/contacts" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.contacts') }}</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3 text-sm uppercase tracking-wide">{{ $t('common.actions') }}</h4>
            <ul class="space-y-2">
              <li><RouterLink to="/tracking" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.tracking') }}</RouterLink></li>
              <li><RouterLink to="/calculator" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.calculator') }}</RouterLink></li>
              <li><RouterLink to="/faq" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.faq') }}</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3 text-sm uppercase tracking-wide">{{ $t('nav.privacy') }}</h4>
            <ul class="space-y-2">
              <li><RouterLink to="/terms" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.terms') }}</RouterLink></li>
              <li><RouterLink to="/privacy" class="text-sm text-gray-400 hover:text-primary transition-colors no-underline">{{ $t('nav.privacy') }}</RouterLink></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p class="text-sm text-gray-500">&copy; 2024 Cargo Express 66. All rights reserved.</p>
          <p class="text-sm text-gray-500">Tajikistan · USA · Germany</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'PublicLayout',

  data() {
    return {
      mobileMenuOpen: false
    }
  },

  computed: {
    isLoggedIn() {
      return useAuthStore().isLoggedIn
    },
    dashboardPath() {
      const store = useAuthStore()
      if (store.isAdmin) return '/admin/dashboard'
      if (store.isWarehouse) return '/warehouse/scanner'
      return '/dashboard'
    },
    currentLocale() {
      return this.$i18n.locale.value || this.$i18n.locale
    },
    navLinks() {
      return [
        { to: '/', label: this.$t('nav.home') },
        { to: '/about', label: this.$t('nav.about') },
        { to: '/how-it-works', label: this.$t('nav.howItWorks') },
        { to: '/pricing', label: this.$t('nav.pricing') },
        { to: '/tracking', label: this.$t('nav.tracking') },
        { to: '/calculator', label: this.$t('nav.calculator') },
        { to: '/contacts', label: this.$t('nav.contacts') },
        { to: '/faq', label: this.$t('nav.faq') }
      ]
    }
  },

  methods: {
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

  watch: {
    '$route'() {
      this.mobileMenuOpen = false
    }
  }
}
</script>
