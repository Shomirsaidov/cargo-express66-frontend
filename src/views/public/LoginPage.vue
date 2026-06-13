<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img src="@/assets/logo.png" alt="Logo" class="w-14 h-14 object-contain rounded-2xl mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('auth.loginTitle') }}</h1>
        <p class="text-gray-500 mt-1 text-sm">Cargo Express 66</p>
      </div>

      <!-- Form card -->
      <div class="card">
        <!-- Error alert -->
        <div v-if="error"
          class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-group">
            <label class="form-label">{{ $t('auth.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="input-field"
              :placeholder="$t('auth.email')"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('auth.password') }}</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="input-field pr-10"
                :placeholder="$t('auth.password')"
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.remember" type="checkbox" class="rounded border-gray-300 text-primary" />
              <span class="text-sm text-gray-600">Запомнить меня</span>
            </label>
            <a href="#" class="text-sm text-primary hover:underline">{{ $t('auth.forgotPassword') }}</a>
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary w-full btn-lg">
            <svg v-if="loading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? $t('common.loading') : $t('auth.loginBtn') }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          {{ $t('auth.noAccount') }}
          <RouterLink to="/register" class="text-primary font-medium hover:underline ml-1">
            {{ $t('nav.register') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'LoginPage',

  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      showPassword: false,
      error: null,
      loading: false
    }
  },

  methods: {
    async handleLogin() {
      this.error = null
      this.loading = true
      try {
        const authStore = useAuthStore()
        const result = await authStore.login({
          email: this.form.email,
          password: this.form.password
        })

        if (result.success) {
          const redirectTo = this.$route.query.redirect
          const role = result.user?.role
          if (redirectTo) {
            this.$router.push(redirectTo)
          } else if (role === 'admin') {
            this.$router.push('/admin/dashboard')
          } else if (role === 'warehouse_employee') {
            this.$router.push('/warehouse/scanner')
          } else {
            this.$router.push('/dashboard')
          }
        } else {
          this.error = result.error || this.$t('auth.loginError')
        }
      } catch (err) {
        this.error = this.$t('auth.loginError')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
