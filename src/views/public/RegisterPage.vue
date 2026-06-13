<template>
  <div class="min-h-[calc(100vh-4rem)] py-12 px-4">
    <div class="w-full max-w-lg mx-auto">
      <div class="text-center mb-8">
        <img src="@/assets/logo.png" alt="Logo" class="w-14 h-14 object-contain rounded-2xl mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('auth.registerTitle') }}</h1>
        <p class="text-gray-500 mt-1 text-sm">Cargo Express 66</p>
      </div>

      <div class="card">
        <div v-if="error"
          class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {{ error }}
        </div>

        <div v-if="successMsg"
          class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          {{ successMsg }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group mb-0">
              <label class="form-label">{{ $t('auth.lastName') }} *</label>
              <input v-model="form.last_name" type="text" required class="input-field"
                :placeholder="$t('auth.lastName')" />
            </div>
            <div class="form-group mb-0">
              <label class="form-label">{{ $t('auth.firstName') }} *</label>
              <input v-model="form.first_name" type="text" required class="input-field"
                :placeholder="$t('auth.firstName')" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('auth.middleName') }}</label>
            <input v-model="form.middle_name" type="text" class="input-field"
              :placeholder="$t('auth.middleName')" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('auth.phone') }} *</label>
            <input v-model="form.phone" type="tel" required class="input-field"
              placeholder="+992 XX XXX XXXX" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('auth.email') }} *</label>
            <input v-model="form.email" type="email" required autocomplete="email" class="input-field"
              :placeholder="$t('auth.email')" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('auth.password') }} *</label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                required autocomplete="new-password" class="input-field pr-10"
                placeholder="Минимум 8 символов" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <!-- Password strength -->
            <div v-if="form.password" class="mt-1.5">
              <div class="flex gap-1">
                <div v-for="i in 4" :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="passwordStrength >= i ? strengthColors[passwordStrength - 1] : 'bg-gray-200'"></div>
              </div>
              <p class="text-xs text-gray-400 mt-1">{{ strengthLabels[passwordStrength - 1] || '' }}</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('auth.confirmPassword') }} *</label>
            <input v-model="form.confirm_password" :type="showPassword ? 'text' : 'password'"
              required class="input-field"
              :class="{ 'error': form.confirm_password && form.password !== form.confirm_password }"
              :placeholder="$t('auth.confirmPassword')" />
            <p v-if="form.confirm_password && form.password !== form.confirm_password"
              class="mt-1 text-xs text-red-500">Пароли не совпадают</p>
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('auth.deliveryAddress') }} *</label>
            <textarea v-model="form.delivery_address" required rows="2" class="input-field resize-none"
              placeholder="Душанбе, ул. Примерная, д. 1"></textarea>
          </div>

          <!-- Agreements -->
          <div class="space-y-3 pt-2 border-t border-gray-100">
            <label class="flex items-start gap-3 cursor-pointer">
              <input v-model="form.agree_terms" type="checkbox" required
                class="mt-0.5 rounded border-gray-300 text-primary" />
              <span class="text-sm text-gray-600">
                {{ $t('auth.agreeTerms') }}
                <RouterLink to="/terms" class="text-primary hover:underline" target="_blank">
                  ({{ $t('nav.terms') }})
                </RouterLink>
              </span>
            </label>
            <label class="flex items-start gap-3 cursor-pointer">
              <input v-model="form.agree_cargo" type="checkbox" required
                class="mt-0.5 rounded border-gray-300 text-primary" />
              <span class="text-sm text-gray-600">{{ $t('auth.agreeCargoRules') }}</span>
            </label>
            <label class="flex items-start gap-3 cursor-pointer">
              <input v-model="form.agree_privacy" type="checkbox" required
                class="mt-0.5 rounded border-gray-300 text-primary" />
              <span class="text-sm text-gray-600">
                {{ $t('auth.agreePrivacy') }}
                <RouterLink to="/privacy" class="text-primary hover:underline" target="_blank">
                  ({{ $t('nav.privacy') }})
                </RouterLink>
              </span>
            </label>
          </div>

          <button type="submit" :disabled="loading || !canSubmit" class="btn btn-primary w-full btn-lg">
            <svg v-if="loading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? $t('common.loading') : $t('auth.registerBtn') }}
          </button>
        </form>

        <div class="mt-4 text-center text-sm text-gray-500">
          {{ $t('auth.hasAccount') }}
          <RouterLink to="/login" class="text-primary font-medium hover:underline ml-1">
            {{ $t('nav.login') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'RegisterPage',

  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        middle_name: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
        delivery_address: '',
        agree_terms: false,
        agree_cargo: false,
        agree_privacy: false
      },
      showPassword: false,
      loading: false,
      error: null,
      successMsg: null,
      strengthColors: ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'],
      strengthLabels: ['Слабый', 'Средний', 'Хороший', 'Сильный']
    }
  },

  computed: {
    passwordStrength() {
      const pwd = this.form.password
      if (!pwd) return 0
      let score = 0
      if (pwd.length >= 8) score++
      if (/[A-Z]/.test(pwd)) score++
      if (/[0-9]/.test(pwd)) score++
      if (/[^A-Za-z0-9]/.test(pwd)) score++
      return score
    },
    canSubmit() {
      return this.form.agree_terms && this.form.agree_cargo && this.form.agree_privacy &&
        this.form.password === this.form.confirm_password && this.form.password.length >= 8
    }
  },

  methods: {
    async handleRegister() {
      this.error = null
      this.successMsg = null

      if (this.form.password !== this.form.confirm_password) {
        this.error = 'Пароли не совпадают'
        return
      }

      this.loading = true
      try {
        const authStore = useAuthStore()
        const payload = {
          first_name: this.form.first_name,
          last_name: this.form.last_name,
          middle_name: this.form.middle_name || null,
          phone: this.form.phone,
          email: this.form.email,
          password: this.form.password,
          delivery_address: this.form.delivery_address
        }

        const result = await authStore.register(payload)
        if (result.success) {
          this.$router.push('/dashboard')
        } else {
          this.error = result.error || this.$t('auth.registerError')
        }
      } catch (err) {
        this.error = this.$t('auth.registerError')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
