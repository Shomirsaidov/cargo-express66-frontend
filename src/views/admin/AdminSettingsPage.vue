<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">{{ $t('admin.settings') }}</h1>
        <p class="text-sm text-gray-500 mt-1">Глобальные системные параметры и константы</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        + Создать параметр
      </button>
    </div>

    <!-- Settings Grid -->
    <div v-if="loading" class="text-center py-12">
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
            <button @click="openEditModal(s)" class="text-xs text-primary hover:underline font-medium">
              Редактировать
            </button>
          </div>
          <p class="text-sm font-semibold text-gray-800 mt-3 break-words">{{ s.value }}</p>
          <p class="text-xs text-gray-400 mt-2 italic">{{ s.description || 'Описание отсутствует' }}</p>
        </div>
      </div>
    </div>

    <!-- Edit/Create Setting Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Редактировать параметр' : 'Создать параметр' }}</h3>

              <form @submit.prevent="saveSetting" class="space-y-4">
                <div>
                  <label class="form-label">Ключ параметра (KEY):</label>
                  <input v-model="form.key" type="text" required class="input-field font-mono" :disabled="isEdit" placeholder="SYSTEM_SUPPORT_PHONE" />
                  <p class="text-[10px] text-gray-400 mt-1">Рекомендуется использовать UPPER_SNAKE_CASE</p>
                </div>

                <div>
                  <label class="form-label">Значение (VALUE):</label>
                  <textarea v-model="form.value" required rows="3" class="input-field" placeholder="Значение параметра..."></textarea>
                </div>

                <div>
                  <label class="form-label">Описание:</label>
                  <textarea v-model="form.description" rows="2" class="input-field text-xs" placeholder="Пояснение, за что отвечает данный параметр..."></textarea>
                </div>

                <div class="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" @click="showModal = false" class="btn btn-ghost flex-1 border border-gray-200">
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
  </div>
</template>

<script>
import { settingsAPI } from '@/api/index.js'

export default {
  name: 'AdminSettingsPage',

  data() {
    return {
      settings: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,

      form: {
        key: '',
        value: '',
        description: ''
      }
    }
  },

  methods: {
    async loadSettings() {
      this.loading = true
      try {
        const r = await settingsAPI.getAll()
        this.settings = r.data.data || []
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    openCreateModal() {
      this.isEdit = false
      this.form = {
        key: '',
        value: '',
        description: ''
      }
      this.showModal = true
    },

    openEditModal(s) {
      this.isEdit = true
      this.form = {
        key: s.key,
        value: s.value,
        description: s.description || ''
      }
      this.showModal = true
    },

    async saveSetting() {
      this.saving = true
      try {
        await settingsAPI.update(this.form.key, {
          value: this.form.value,
          description: this.form.description
        })
        alert('Параметр успешно сохранен!')
        this.showModal = false
        this.loadSettings()
      } catch (e) {
        alert('Ошибка при сохранении параметра')
      } finally {
        this.saving = false
      }
    }
  },

  mounted() {
    this.loadSettings()
  }
}
</script>
