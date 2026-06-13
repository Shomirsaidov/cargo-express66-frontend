<template>
  <div class="p-4 sm:p-6 max-w-xl mx-auto">
    <h1 class="page-title mb-6">{{ $t('admin.settings') }}</h1>

    <div class="card mb-4">
      <h2 class="section-title mb-4">Язык интерфейса</h2>
      <div class="flex gap-3">
        <button @click="setLocale('ru')"
          class="flex-1 py-3 rounded-xl border-2 transition-all font-medium"
          :class="currentLocale === 'ru' ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 text-gray-600'">
          Русский
        </button>
        <button @click="setLocale('en')"
          class="flex-1 py-3 rounded-xl border-2 transition-all font-medium"
          :class="currentLocale === 'en' ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 text-gray-600'">
          English
        </button>
      </div>
    </div>

    <div class="card mb-4">
      <h2 class="section-title mb-4">Уведомления</h2>
      <div class="space-y-3">
        <label v-for="pref in notifPrefs" :key="pref.key"
          class="flex items-center justify-between py-2 border-b border-gray-50 cursor-pointer last:border-0">
          <span class="text-sm text-gray-700">{{ pref.label }}</span>
          <div class="relative">
            <input type="checkbox" v-model="pref.enabled" class="sr-only" />
            <div class="w-10 h-6 rounded-full transition-colors cursor-pointer"
              :class="pref.enabled ? 'bg-primary' : 'bg-gray-200'"
              @click="pref.enabled = !pref.enabled">
              <div class="w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform"
                :class="pref.enabled ? 'translate-x-5' : 'translate-x-1'"></div>
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      notifPrefs: [
        { key: 'received', label: 'Посылка получена на склад', enabled: true },
        { key: 'dispatched', label: 'Посылка отправлена', enabled: true },
        { key: 'arrived', label: 'Посылка прибыла в Душанбе', enabled: true },
        { key: 'ready', label: 'Готово к выдаче', enabled: true },
        { key: 'delivered', label: 'Посылка доставлена', enabled: true }
      ]
    }
  },
  computed: {
    currentLocale() {
      return this.$i18n.locale.value || this.$i18n.locale
    }
  },
  methods: {
    setLocale(locale) {
      if (typeof this.$i18n.locale === 'object' && this.$i18n.locale !== null && 'value' in this.$i18n.locale) {
        this.$i18n.locale.value = locale
      } else {
        this.$i18n.locale = locale
      }
      localStorage.setItem('locale', locale)
    }
  }
}
</script>
