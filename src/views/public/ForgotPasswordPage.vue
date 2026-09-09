<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="@/assets/logo.png" alt="Cargo Express 66" class="w-14 h-14 object-contain rounded-2xl mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('auth.forgotPasswordTitle') }}</h1>
        <p class="text-gray-500 mt-2 text-sm">{{ $t('auth.forgotPasswordDescription') }}</p>
      </div>

      <div class="card">
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {{ success }}
        </div>

        <form v-if="step === 'email'" @submit.prevent="sendCode" class="space-y-4">
          <div class="form-group">
            <label class="form-label">{{ $t('auth.email') }}</label>
            <input v-model.trim="email" type="email" required autocomplete="email" class="input-field" :placeholder="$t('auth.email')" />
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-full btn-lg">
            {{ loading ? $t('common.loading') : $t('auth.sendCode') }}
          </button>
        </form>

        <form v-else-if="step === 'code'" @submit.prevent="resetPassword" class="space-y-4">
          <p class="text-sm text-gray-600 mb-4">{{ $t('auth.codeSent') }}</p>
          <div class="form-group">
            <label class="form-label">{{ $t('auth.verificationCode') }}</label>
            <input v-model.trim="otp" type="text" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required autocomplete="one-time-code" class="input-field tracking-[0.35em]" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ $t('auth.newPassword') }}</label>
            <input v-model="newPassword" type="password" minlength="8" required autocomplete="new-password" class="input-field" />
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-full btn-lg">
            {{ loading ? $t('common.loading') : $t('auth.resetPassword') }}
          </button>
          <button type="button" :disabled="loading" @click="sendCode" class="w-full text-sm text-primary hover:underline">
            {{ $t('auth.resendCode') }}
          </button>
        </form>

        <div v-else class="text-center">
          <p class="text-green-700 mb-6">{{ success }}</p>
          <RouterLink to="/login" class="btn btn-primary w-full btn-lg no-underline">{{ $t('auth.backToLogin') }}</RouterLink>
        </div>

        <div v-if="step !== 'success'" class="mt-6 text-center text-sm">
          <RouterLink to="/login" class="text-primary hover:underline">{{ $t('auth.backToLogin') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/api/index.js'

export default {
  name: 'ForgotPasswordPage',

  data() {
    return {
      email: '',
      otp: '',
      newPassword: '',
      step: 'email',
      loading: false,
      error: null,
      success: null,
    }
  },

  methods: {
    getError(error) {
      const requestId = error.response?.data?.request_id || error.response?.headers?.['x-request-id']
      if (error.code === 'ERR_CANCELED') {
        return `Request was cancelled${requestId ? ` (request ${requestId})` : ''}. Please try again.`
      }
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        return `The server took too long to respond${requestId ? ` (request ${requestId})` : ''}. Please try again.`
      }
      if (!error.response) {
        return `Could not reach the email service${requestId ? ` (request ${requestId})` : ''}. Please try again.`
      }
      return error.response.data?.error || `Request failed${requestId ? ` (request ${requestId})` : ''}.`
    },

    async sendCode() {
      this.error = null
      this.success = null
      this.loading = true
      try {
        const response = await authAPI.forgotPassword({ email: this.email })
        console.info('[OTP] Password reset request accepted', {
          requestId: response.data?.request_id || response.headers?.['x-request-id'],
          status: response.status,
        })
        this.step = 'code'
        this.success = null
      } catch (error) {
        this.error = this.getError(error)
      } finally {
        this.loading = false
      }
    },

    async resetPassword() {
      this.error = null
      this.loading = true
      try {
        const response = await authAPI.resetPassword({
          email: this.email,
          otp: this.otp,
          new_password: this.newPassword,
        })
        this.success = response.data.message || this.$t('auth.passwordResetSuccess')
        this.step = 'success'
      } catch (error) {
        this.error = this.getError(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>