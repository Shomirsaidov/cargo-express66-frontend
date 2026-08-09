<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="page-title">{{ $t('admin.settings') }}</h1>
        <p class="text-sm text-gray-500 mt-1">Управление глобальными системными параметрами и направлениями доставки</p>
      </div>
      <div class="flex items-center gap-2">
        <button v-if="activeTab === 'settings'" @click="openCreateSettingModal" class="btn btn-primary">
          + Создать параметр
        </button>
        <button v-if="activeTab === 'countries'" @click="openCreateCountryModal" class="btn btn-primary">
          + Добавить страну
        </button>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex border-b border-gray-200">
      <button
        @click="activeTab = 'settings'"
        :class="[
          'px-6 py-3 font-semibold text-sm transition-all border-b-2',
          activeTab === 'settings'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        ⚙️ Глобальные параметры
      </button>
      <button
        @click="activeTab = 'countries'"
        :class="[
          'px-6 py-3 font-semibold text-sm transition-all border-b-2',
          activeTab === 'countries'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        📍 Страны назначения
      </button>
    </div>

    <!-- TAB 1: Global Parameters -->
    <div v-if="activeTab === 'settings'" class="space-y-6">
      <div v-if="loadingSettings" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="settings.length === 0" class="card p-12 text-center text-gray-400">
        Параметры не найдены. Создайте первый параметр для конфигурации системы.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="s in settings" :key="s.key" class="card p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <span class="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                {{ s.key }}
              </span>
              <button @click="openEditSettingModal(s)" class="text-xs text-primary hover:underline font-medium">
                Редактировать
              </button>
            </div>
            <p class="text-sm font-semibold text-gray-800 mt-3 break-words">{{ s.value }}</p>
            <p class="text-xs text-gray-400 mt-2 italic">{{ s.description || 'Описание отсутствует' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Destination Countries CRUD -->
    <div v-if="activeTab === 'countries'" class="space-y-6">
      <div v-if="loadingCountries" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else class="card overflow-hidden">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th class="p-4">Название страны</th>
              <th class="p-4">Статус</th>
              <th class="p-4">Дата добавления</th>
              <th class="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="c in countries" :key="c.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="p-4 font-semibold text-gray-800">{{ c.name }}</td>
              <td class="p-4">
                <button
                  @click="toggleCountryStatus(c)"
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all',
                    c.is_active
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  ]"
                >
                  {{ c.is_active ? 'Активна' : 'Неактивна' }}
                </button>
              </td>
              <td class="p-4 text-xs text-gray-400">
                {{ formatDate(c.created_at) || 'Сгенерировано' }}
              </td>
              <td class="p-4 text-right space-x-2">
                <button @click="openEditCountryModal(c)" class="text-xs text-primary hover:underline">
                  Редактировать
                </button>
                <button @click="deleteCountry(c)" class="text-xs text-red-500 hover:underline">
                  Удалить
                </button>
              </td>
            </tr>
            <tr v-if="countries.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-400">
                Список стран пуст. Добавьте первую страну для доставки.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <!-- Setting Modal -->
      <transition name="fade">
        <div v-if="showSettingModal" class="modal-overlay" @click.self="showSettingModal = false">
          <div class="modal-content max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Редактировать параметр' : 'Создать параметр' }}</h3>
              <form @submit.prevent="saveSetting" class="space-y-4">
                <div>
                  <label class="form-label">Ключ параметра (KEY):</label>
                  <input v-model="settingForm.key" type="text" required class="input-field font-mono" :disabled="isEdit" placeholder="SYSTEM_SUPPORT_PHONE" />
                  <p class="text-[10px] text-gray-400 mt-1">Рекомендуется использовать UPPER_SNAKE_CASE</p>
                </div>
                <div>
                  <label class="form-label">Значение (VALUE):</label>
                  <textarea v-model="settingForm.value" required rows="3" class="input-field" placeholder="Значение параметра..."></textarea>
                </div>
                <div>
                  <label class="form-label">Описание:</label>
                  <textarea v-model="settingForm.description" rows="2" class="input-field text-xs" placeholder="Пояснение, за что отвечает данный параметр..."></textarea>
                </div>
                <div class="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" @click="showSettingModal = false" class="btn btn-ghost flex-1 border border-gray-200">
                    Отмена
                  </button>
                  <button type="submit" class="btn btn-primary flex-1" :disabled="saving">
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <!-- Country Modal -->
      <transition name="fade">
        <div v-if="showCountryModal" class="modal-overlay" @click.self="showCountryModal = false">
          <div class="modal-content max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEditCountry ? 'Редактировать страну назначения' : 'Добавить страну назначения' }}</h3>
              <form @submit.prevent="saveCountry" class="space-y-4">
                <div>
                  <label class="form-label">Название страны:</label>
                  <input v-model="countryForm.name" type="text" required class="input-field" placeholder="Например: Таджикистан, Узбекистан..." />
                </div>
                <div class="flex items-center gap-2">
                  <input v-model="countryForm.is_active" type="checkbox" id="country-active" class="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <label for="country-active" class="text-sm font-medium text-gray-700">Активна для доставки</label>
                </div>
                <div class="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" @click="showCountryModal = false" class="btn btn-ghost flex-1 border border-gray-200">
                    Отмена
                  </button>
                  <button type="submit" class="btn btn-primary flex-1" :disabled="savingCountry">
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { settingsAPI, destinationCountriesAPI } from '@/api/index.js'

export default {
  name: 'AdminSettingsPage',

  data() {
    return {
      activeTab: 'settings',
      
      // Global parameters
      settings: [],
      loadingSettings: false,
      saving: false,
      showSettingModal: false,
      isEdit: false,
      settingForm: {
        key: '',
        value: '',
        description: ''
      },

      // Destination countries
      countries: [],
      loadingCountries: false,
      savingCountry: false,
      showCountryModal: false,
      isEditCountry: false,
      editingCountryId: null,
      countryForm: {
        name: '',
        is_active: true
      }
    }
  },

  methods: {
    formatDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
    },

    // settings handlers
    async loadSettings() {
      this.loadingSettings = true
      try {
        const r = await settingsAPI.getAll()
        this.settings = r.data.data || []
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingSettings = false
      }
    },

    openCreateSettingModal() {
      this.isEdit = false
      this.settingForm = {
        key: '',
        value: '',
        description: ''
      }
      this.showSettingModal = true
    },

    openEditSettingModal(s) {
      this.isEdit = true
      this.settingForm = {
        key: s.key,
        value: s.value,
        description: s.description || ''
      }
      this.showSettingModal = true
    },

    async saveSetting() {
      this.saving = true
      try {
        await settingsAPI.update(this.settingForm.key, {
          value: this.settingForm.value,
          description: this.settingForm.description
        })
        alert('Параметр успешно сохранен!')
        this.showSettingModal = false
        this.loadSettings()
      } catch (e) {
        alert('Ошибка при сохранении параметра')
      } finally {
        this.saving = false
      }
    },

    // Destination Countries handlers
    async loadCountries() {
      this.loadingCountries = true
      try {
        const r = await destinationCountriesAPI.getAll()
        this.countries = r.data.data || []
      } catch (e) {
        console.error('Failed to load destination countries:', e)
      } finally {
        this.loadingCountries = false
      }
    },

    openCreateCountryModal() {
      this.isEditCountry = false
      this.editingCountryId = null
      this.countryForm = {
        name: '',
        is_active: true
      }
      this.showCountryModal = true
    },

    openEditCountryModal(c) {
      this.isEditCountry = true
      this.editingCountryId = c.id
      this.countryForm = {
        name: c.name,
        is_active: c.is_active
      }
      this.showCountryModal = true
    },

    async saveCountry() {
      this.savingCountry = true
      try {
        if (this.isEditCountry) {
          await destinationCountriesAPI.update(this.editingCountryId, this.countryForm)
        } else {
          await destinationCountriesAPI.create(this.countryForm)
        }
        alert('Страна успешно сохранена!')
        this.showCountryModal = false
        this.loadCountries()
      } catch (e) {
        alert(e.response?.data?.error || 'Ошибка при сохранении страны')
      } finally {
        this.savingCountry = false
      }
    },

    async toggleCountryStatus(c) {
      try {
        await destinationCountriesAPI.update(c.id, { is_active: !c.is_active })
        this.loadCountries()
      } catch (e) {
        alert('Не удалось изменить статус страны')
      }
    },

    async deleteCountry(c) {
      if (confirm(`Вы уверены, что хотите удалить страну "${c.name}"?`)) {
        try {
          await destinationCountriesAPI.delete(c.id)
          alert('Страна успешно удалена')
          this.loadCountries()
        } catch (e) {
          alert('Не удалось удалить страну')
        }
      }
    }
  },

  mounted() {
    this.loadSettings()
    this.loadCountries()
  }
}
</script>
