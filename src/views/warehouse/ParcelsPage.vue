<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">{{ $t('warehouse.parcels') }}</h1>
        <p class="text-sm text-gray-500 mt-1">Список посылок, принятых на складах</p>
      </div>
      <RouterLink to="/warehouse/scanner" class="btn btn-primary">
        + Сканировать посылку
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Поиск по трек-номеру..."
          class="input-field pl-9 w-72" @keyup.enter="loadParcels" />
      </div>

      <select v-model="statusFilter" class="input-field w-44" @change="loadParcels">
        <option value="">Все статусы</option>
        <option value="received_at_warehouse">Принято на склад</option>
        <option value="processing">Обработка</option>
        <option value="unknown_recipient">Неизвестный получатель</option>
        <option value="delivered">Доставлено</option>
      </select>

      <button @click="loadParcels" class="btn btn-ghost border border-gray-200">
        Обновить 🔄
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Трек-номер</th>
            <th>Получатель</th>
            <th>Склад</th>
            <th>Вес (кг)</th>
            <th>Статус</th>
            <th>Принято</th>
            <th>Заметки</th>
            <th>{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-8">
              <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </td>
          </tr>
          <tr v-else-if="parcels.length === 0">
            <td colspan="8" class="text-center py-8 text-gray-400">Посылки не найдены</td>
          </tr>
          <tr v-else v-for="p in parcels" :key="p.id">
            <td class="font-mono text-sm font-semibold text-gray-900">{{ p.tracking_number }}</td>
            <td>
              <div v-if="p.customers">
                <p class="font-medium text-gray-800 text-xs">{{ p.customers.last_name }} {{ p.customers.first_name }}</p>
                <p class="text-[10px] font-mono text-primary font-semibold">{{ p.customers.customer_code }}</p>
              </div>
              <span v-else class="text-xs text-danger font-medium italic">Неизвестно</span>
            </td>
            <td class="text-xs text-gray-600">
              {{ p.warehouses ? `${p.warehouses.name} (${p.warehouses.country})` : '—' }}
            </td>
            <td class="font-semibold text-gray-700 text-xs">{{ p.weight || '—' }}</td>
            <td>
              <StatusBadge :status="p.status" />
            </td>
            <td class="text-gray-500 text-[10px]">{{ formatDate(p.arrival_date || p.created_at) }}</td>
            <td class="text-xs text-gray-500 max-w-[150px] truncate" :title="p.notes">{{ p.notes || '—' }}</td>
            <td>
              <div class="flex items-center gap-1">
                <button @click="openEditStatus(p)"
                  class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all text-xs"
                  title="Изменить статус/данные">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Status & Info Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="editingParcel" class="modal-overlay" @click.self="editingParcel = null">
          <div class="modal-content max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">Редактировать параметры посылки</h3>
              <p class="text-sm font-mono text-gray-600 mb-4">
                Трек-номер: {{ editingParcel.tracking_number }}
              </p>

              <div class="space-y-4 mb-6">
                <div>
                  <label class="form-label">Статус:</label>
                  <select v-model="form.status" class="input-field">
                    <option value="received_at_warehouse">Принято на склад</option>
                    <option value="processing">Обработка</option>
                    <option value="in_transit">В пути</option>
                    <option value="arrived_in_dushanbe">Прибыл в Душанбе</option>
                    <option value="customs_clearance">Таможенное оформление</option>
                    <option value="ready_for_pickup">Готово к выдаче</option>
                    <option value="delivered">Доставлено</option>
                    <option value="cancelled">Отменено</option>
                    <option value="unknown_recipient">Неизвестный получатель</option>
                  </select>
                </div>

                <div>
                  <label class="form-label">Вес (кг):</label>
                  <input v-model="form.weight" type="number" step="0.01" class="input-field" />
                </div>

                <div>
                  <label class="form-label">Заметки:</label>
                  <textarea v-model="form.notes" rows="2" class="input-field"></textarea>
                </div>
              </div>

              <div class="flex gap-3">
                <button @click="editingParcel = null" class="btn btn-ghost flex-1 border border-gray-200">
                  Отмена
                </button>
                <button @click="saveChanges" class="btn btn-primary flex-1" :disabled="saving">
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { scannerAPI, parcelsAPI } from '@/api/index.js'
import StatusBadge from '@/components/common/StatusBadge.vue'

export default {
  name: 'WarehouseParcelsPage',

  components: { StatusBadge },

  data() {
    return {
      parcels: [],
      loading: false,
      saving: false,
      search: '',
      statusFilter: '',
      editingParcel: null,

      form: {
        status: '',
        weight: '',
        notes: ''
      }
    }
  },

  methods: {
    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    },

    async loadParcels() {
      this.loading = true
      try {
        const params = {}
        if (this.search.trim()) params.search = this.search.trim()
        if (this.statusFilter) params.status = this.statusFilter

        const r = await scannerAPI.getParcels(params)
        this.parcels = r.data.data || []
      } catch (e) {
        this.parcels = []
      } finally {
        this.loading = false
      }
    },

    openEditStatus(parcel) {
      this.editingParcel = parcel
      this.form = {
        status: parcel.status,
        weight: parcel.weight || '',
        notes: parcel.notes || ''
      }
    },

    async saveChanges() {
      if (!this.editingParcel) return

      this.saving = true
      try {
        // Update status using parcels status endpoint
        await parcelsAPI.updateStatus(this.editingParcel.id, this.form.status)

        // Update other fields using general parcels update endpoint
        await parcelsAPI.update(this.editingParcel.id, {
          weight: this.form.weight ? parseFloat(this.form.weight) : null,
          notes: this.form.notes
        })

        alert('Посылка успешно обновлена!')
        this.editingParcel = null
        this.loadParcels()
      } catch (e) {
        alert('Ошибка при обновлении посылки')
      } finally {
        this.saving = false
      }
    }
  },

  mounted() {
    this.loadParcels()
  }
}
</script>
