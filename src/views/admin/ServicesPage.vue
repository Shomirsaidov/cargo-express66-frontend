<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">{{ $t('admin.services') }}</h1>
        <p class="text-sm text-gray-500 mt-1">Дополнительные услуги для посылок (страхование, проверка, фотоотчет)</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        + Создать услугу
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Название услуги</th>
            <th>Тип цены</th>
            <th>Стоимость</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="text-center py-6">
            <td colspan="6">
              <div class="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </td>
          </tr>
          <tr v-else-if="services.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-400">Услуги не настроены</td>
          </tr>
          <tr v-else v-for="s in services" :key="s.id">
            <td class="font-semibold text-gray-900 text-sm">{{ s.name }}</td>
            <td class="text-xs">
              <span class="badge" :class="s.price_type === 'fixed' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'">
                {{ s.price_type === 'fixed' ? 'Фиксированная' : 'Процент от доставки' }}
              </span>
            </td>
            <td class="font-semibold text-gray-700 text-sm">
              <span v-if="s.price_type === 'fixed'">${{ s.price }}</span>
              <span v-else>{{ s.percentage }}% <span class="text-xs font-normal text-gray-400">(мин. ${{ s.minimum_fee || '0' }})</span></span>
            </td>
            <td class="text-xs text-gray-500 max-w-[200px] truncate" :title="s.description">{{ s.description || '—' }}</td>
            <td>
              <span class="badge"
                :class="s.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ s.is_active !== false ? 'Активна' : 'Неактивна' }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <button @click="openEditModal(s)" class="text-xs text-primary hover:underline">Изм.</button>
                <button @click="confirmDelete(s)" class="text-xs text-danger hover:underline">Удал.</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Редактировать услугу' : 'Создать услугу' }}</h3>

              <form @submit.prevent="saveService" class="space-y-4">
                <div>
                  <label class="form-label">Название услуги:</label>
                  <input v-model="form.name" type="text" required class="input-field" placeholder="Страховка / Проверка на брак" />
                </div>

                <div>
                  <label class="form-label">Тип цены:</label>
                  <select v-model="form.price_type" class="input-field">
                    <option value="fixed">Фиксированная ставка ($)</option>
                    <option value="percentage">Процент от стоимости доставки (%)</option>
                  </select>
                </div>

                <div v-if="form.price_type === 'fixed'">
                  <label class="form-label">Стоимость ($):</label>
                  <input v-model="form.price" type="number" step="0.01" required class="input-field" placeholder="5.00" />
                </div>

                <div v-else class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="form-label">Процент (%):</label>
                    <input v-model="form.percentage" type="number" step="0.1" required class="input-field" placeholder="3.0" />
                  </div>
                  <div>
                    <label class="form-label">Мин. плата ($):</label>
                    <input v-model="form.minimum_fee" type="number" step="0.1" class="input-field" placeholder="2.0" />
                  </div>
                </div>

                <div>
                  <label class="form-label">Описание:</label>
                  <textarea v-model="form.description" rows="2" class="input-field text-xs" placeholder="Краткое описание услуги для клиентов..."></textarea>
                </div>

                <div class="flex items-center gap-2">
                  <input v-model="form.is_active" type="checkbox" id="s_active" class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <label for="s_active" class="text-sm text-gray-700 font-medium">Услуга активна</label>
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
import { servicesAPI } from '@/api/index.js'

export default {
  name: 'AdminServicesPage',

  data() {
    return {
      services: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      editingId: null,

      form: {
        name: '',
        description: '',
        price_type: 'fixed',
        price: '',
        percentage: '',
        minimum_fee: '',
        is_active: true
      }
    }
  },

  methods: {
    async loadServices() {
      this.loading = true
      try {
        const r = await servicesAPI.getAll()
        this.services = r.data.data || []
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    openCreateModal() {
      this.isEdit = false
      this.editingId = null
      this.form = {
        name: '',
        description: '',
        price_type: 'fixed',
        price: '',
        percentage: '',
        minimum_fee: '',
        is_active: true
      }
      this.showModal = true
    },

    openEditModal(s) {
      this.isEdit = true
      this.editingId = s.id
      this.form = {
        name: s.name,
        description: s.description || '',
        price_type: s.price_type,
        price: s.price || '',
        percentage: s.percentage || '',
        minimum_fee: s.minimum_fee || '',
        is_active: s.is_active !== false
      }
      this.showModal = true
    },

    async saveService() {
      this.saving = true
      try {
        const payload = {
          name: this.form.name,
          description: this.form.description,
          price_type: this.form.price_type,
          is_active: this.form.is_active
        }

        if (this.form.price_type === 'fixed') {
          payload.price = parseFloat(this.form.price)
          payload.percentage = null
          payload.minimum_fee = null
        } else {
          payload.price = null
          payload.percentage = parseFloat(this.form.percentage)
          payload.minimum_fee = this.form.minimum_fee ? parseFloat(this.form.minimum_fee) : null
        }

        if (this.isEdit) {
          await servicesAPI.update(this.editingId, payload)
        } else {
          await servicesAPI.create(payload)
        }
        alert('Услуга сохранена!')
        this.showModal = false
        this.loadServices()
      } catch (e) {
        alert('Ошибка при сохранении')
      } finally {
        this.saving = false
      }
    },

    async confirmDelete(s) {
      if (confirm(`Удалить услугу ${s.name}?`)) {
        try {
          await servicesAPI.delete(s.id)
          alert('Услуга удалена')
          this.loadServices()
        } catch (e) {
          alert('Ошибка удаления')
        }
      }
    }
  },

  mounted() {
    this.loadServices()
  }
}
</script>
