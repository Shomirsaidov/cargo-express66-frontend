<template>
  <div class="p-4 sm:p-6 max-w-xl mx-auto">
    <h1 class="page-title mb-6">{{ $t('profile.title') }}</h1>

    <!-- Customer ID Card -->
    <div class="bg-gradient-to-r from-primary-600 to-primary rounded-2xl p-5 mb-6 text-white">
      <p class="text-xs text-blue-200 mb-1">{{ $t('profile.customerId') }}</p>
      <p class="text-3xl font-bold tracking-wider">{{ customerCode }}</p>
      <p class="text-xs text-blue-200 mt-3">{{ $t('profile.registrationDate') }}: {{ registrationDate }}</p>
    </div>

    <!-- Profile form -->
    <div class="card mb-4">
      <div class="flex items-center justify-between mb-5">
        <h2 class="section-title">{{ $t('profile.editProfile') }}</h2>
        <button v-if="!editing" @click="startEdit" class="btn btn-outline btn-sm">
          {{ $t('profile.editProfile') }}
        </button>
      </div>

      <div v-if="successMsg" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
        {{ successMsg }}
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group mb-0">
            <label class="form-label">{{ $t('auth.lastName') }}</label>
            <input v-model="form.last_name" type="text" :readonly="!editing" class="input-field"
              :class="{ 'bg-gray-50': !editing }" />
          </div>
          <div class="form-group mb-0">
            <label class="form-label">{{ $t('auth.firstName') }}</label>
            <input v-model="form.first_name" type="text" :readonly="!editing" class="input-field"
              :class="{ 'bg-gray-50': !editing }" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('auth.middleName') }}</label>
          <input v-model="form.middle_name" type="text" :readonly="!editing" class="input-field"
            :class="{ 'bg-gray-50': !editing }" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('profile.phone') }}</label>
          <input v-model="form.phone" type="tel" :readonly="!editing" class="input-field"
            :class="{ 'bg-gray-50': !editing }" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('profile.email') }}</label>
          <input v-model="form.email" type="email" readonly class="input-field bg-gray-50" />
          <p class="text-xs text-gray-400 mt-1">Email нельзя изменить</p>
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('profile.deliveryAddress') }}</label>
          <textarea v-model="form.delivery_address" :readonly="!editing" rows="2"
            class="input-field resize-none"
            :class="{ 'bg-gray-50': !editing }"></textarea>
        </div>

        <div v-if="editing" class="flex gap-3 pt-2">
          <button type="button" @click="cancelEdit" class="btn btn-ghost flex-1 border border-gray-200">
            {{ $t('common.cancel') }}
          </button>
          <button type="submit" :disabled="saving" class="btn btn-primary flex-1">
            {{ saving ? $t('common.loading') : $t('profile.saveChanges') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Change password -->
    <div class="card">
      <h2 class="section-title mb-4">{{ $t('profile.changePassword') }}</h2>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div class="form-group">
          <label class="form-label">{{ $t('profile.currentPassword') }}</label>
          <input v-model="pwForm.current" type="password" class="input-field" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ $t('profile.newPassword') }}</label>
          <input v-model="pwForm.newPassword" type="password" class="input-field" placeholder="Минимум 8 символов" />
        </div>
        <button type="submit" :disabled="!pwForm.current || !pwForm.newPassword || savingPw"
          class="btn btn-outline">
          {{ savingPw ? $t('common.loading') : $t('profile.changePassword') }}
        </button>
      </form>
    </div>

    <!-- Logout -->
    <button @click="logout" class="btn btn-ghost w-full mt-4 text-red-500 border border-red-100">
      {{ $t('nav.logout') }}
    </button>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { authAPI } from '@/api/index.js'

export default {
  name: 'ProfilePage',

  data() {
    return {
      editing: false,
      saving: false,
      savingPw: false,
      successMsg: null,
      form: {
        first_name: '',
        last_name: '',
        middle_name: '',
        phone: '',
        email: '',
        delivery_address: ''
      },
      pwForm: {
        current: '',
        newPassword: ''
      }
    }
  },

  computed: {
    authStore() { return useAuthStore() },
    customerCode() {
      return this.authStore.user?.customer_code || `CX66-${String(this.authStore.user?.id || 0).padStart(6, '0')}`
    },
    registrationDate() {
      const d = this.authStore.user?.created_at
      if (!d) return '—'
      return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
    }
  },

  methods: {
    startEdit() {
      this.editing = true
      this.successMsg = null
    },
    cancelEdit() {
      this.editing = false
      this.loadUserData()
    },
    loadUserData() {
      const user = this.authStore.user || {}
      this.form = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        phone: user.phone || '',
        email: user.email || '',
        delivery_address: user.delivery_address || ''
      }
    },
    async saveProfile() {
      this.saving = true
      const result = await this.authStore.updateProfile({
        first_name: this.form.first_name,
        last_name: this.form.last_name,
        middle_name: this.form.middle_name,
        phone: this.form.phone,
        delivery_address: this.form.delivery_address
      })
      this.saving = false
      if (result.success) {
        this.editing = false
        this.successMsg = 'Профиль успешно обновлён!'
        setTimeout(() => { this.successMsg = null }, 3000)
      }
    },
    async changePassword() {
      this.savingPw = true
      try {
        await authAPI.changePassword({
          current_password: this.pwForm.current,
          new_password: this.pwForm.newPassword
        })
        this.pwForm = { current: '', newPassword: '' }
        this.successMsg = 'Пароль успешно изменён!'
        setTimeout(() => { this.successMsg = null }, 3000)
      } catch (err) {
        alert(err.response?.data?.message || 'Ошибка изменения пароля')
      } finally {
        this.savingPw = false
      }
    },
    logout() {
      this.authStore.logout()
      this.$router.push('/')
    }
  },

  mounted() {
    this.loadUserData()
  }
}
</script>
