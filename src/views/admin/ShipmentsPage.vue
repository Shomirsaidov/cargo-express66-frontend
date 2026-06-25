<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">{{ $t('admin.shipments') }}</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        + Создать отправление
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Поиск по трек-номеру..."
          class="input-field pl-9 w-64" @keyup.enter="loadParcels" />
      </div>

      <select v-model="statusFilter" class="input-field w-40" @change="loadParcels">
        <option value="">Все статусы</option>
        <option v-for="(label, key) in statuses" :key="key" :value="key">
          {{ label }}
        </option>
      </select>

      <select v-model="warehouseFilter" class="input-field w-44" @change="loadParcels">
        <option value="">Все склады</option>
        <option v-for="w in warehouses" :key="w.id" :value="w.id">
          {{ w.name }} ({{ w.country }})
        </option>
      </select>

      <button @click="loadParcels" class="btn btn-ghost border border-gray-200">
        Применить 🔄
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Трек-номер</th>
            <th>Клиент</th>
            <th>Склад</th>
            <th>Вес (кг)</th>
            <th>Стоимость ($)</th>
            <th>Статус</th>
            <th>Создано</th>
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
            <td colspan="8" class="text-center py-8 text-gray-400">Отправления не найдены</td>
          </tr>
          <tr v-else v-for="p in parcels" :key="p.id">
            <td class="font-mono text-sm font-semibold text-gray-900">{{ p.tracking_number }}</td>
            <td>
              <div v-if="p.customers">
                <p class="font-medium text-gray-800 text-xs">{{ p.customers.last_name }} {{ p.customers.first_name }}</p>
                <p class="text-[10px] font-mono text-primary font-semibold">{{ p.customers.customer_code }}</p>
              </div>
              <span v-else class="text-xs text-red-500 font-medium italic">Unknown Recipient</span>
            </td>
            <td class="text-xs text-gray-600">
              {{ p.warehouses ? `${p.warehouses.name} (${p.warehouses.country})` : '—' }}
            </td>
            <td class="font-semibold text-gray-700 text-xs">{{ p.weight || '—' }}</td>
            <td class="font-semibold text-gray-900 text-xs">${{ p.total_cost || '0.00' }}</td>
            <td>
              <StatusBadge :status="p.status" />
            </td>
            <td class="text-gray-500 text-[10px]">{{ formatDate(p.created_at) }}</td>
            <td>
              <div class="flex items-center gap-1">
                <button @click="openEditModal(p)"
                  class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all text-xs"
                  title="Редактировать">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
                <button @click="confirmDelete(p)"
                  class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Удалить">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.limit" class="flex justify-between items-center mt-4">
      <span class="text-xs text-gray-500">Показано {{ parcels.length }} из {{ pagination.total }}</span>
      <div class="flex gap-2">
        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn btn-ghost border border-gray-200 btn-sm">
          Назад
        </button>
        <button @click="changePage(pagination.page + 1)" :disabled="parcels.length < pagination.limit" class="btn btn-ghost border border-gray-200 btn-sm">
          Вперед
        </button>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content max-w-lg">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Редактировать отправление' : 'Создать отправление' }}</h3>

              <form @submit.prevent="saveParcel" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Трек-номер:</label>
                    <input v-model="form.tracking_number" type="text" required class="input-field" :disabled="isEdit" @change="lookupTrackingNumber" />
                  </div>

                  <div>
                    <label class="form-label">Склад:</label>
                    <select v-model="form.warehouse_id" required class="input-field">
                      <option v-for="w in warehouses" :key="w.id" :value="w.id">
                        {{ w.name }} ({{ w.country }})
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Вес (кг):</label>
                    <input v-model="form.weight" type="number" step="0.01" class="input-field" />
                  </div>

                  <div>
                    <label class="form-label">Объявленная ценность ($):</label>
                    <input v-model="form.declared_value" type="number" step="0.1" class="input-field" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Размеры (ДхШхВ):</label>
                    <input v-model="form.dimensions" type="text" placeholder="30x20x10" class="input-field" />
                  </div>

                  <div>
                    <label class="form-label">Статус:</label>
                    <select v-model="form.status" class="input-field">
                      <option v-for="(label, key) in statuses" :key="key" :value="key">
                        {{ label }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Client Search Selector -->
                <div>
                  <label class="form-label">Назначить клиента:</label>
                  <div v-if="selectedCustomer" class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <p class="text-sm font-semibold text-gray-800">{{ selectedCustomer.last_name }} {{ selectedCustomer.first_name }}</p>
                      <p class="text-xs font-mono text-primary">{{ selectedCustomer.customer_code }}</p>
                    </div>
                    <button type="button" @click="clearCustomer" class="text-xs text-red-500 hover:underline">
                      Отвязать
                    </button>
                  </div>
                  <div v-else class="space-y-2">
                    <input v-model="customerQuery" type="text" placeholder="Поиск клиента..." class="input-field" @input="searchCustomers" @focus="searchCustomers" />
                    <div v-if="customerResults.length > 0" class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                      <div v-for="c in customerResults" :key="c.id" @click="selectCustomer(c)"
                        class="p-2 text-xs hover:bg-primary-50 cursor-pointer flex justify-between">
                        <span>{{ c.last_name }} {{ c.first_name }} ({{ c.customer_code }})</span>
                        <span class="text-primary">Выбрать</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="form-label">Заметки:</label>
                  <textarea v-model="form.notes" rows="2" class="input-field"></textarea>
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
import { parcelsAPI, warehousesAPI, scannerAPI } from '@/api/index.js'
import StatusBadge from '@/components/common/StatusBadge.vue'

export default {
  name: 'AdminShipmentsPage',

  components: { StatusBadge },

  data() {
    return {
      parcels: [],
      warehouses: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      editingId: null,

      search: '',
      statusFilter: '',
      warehouseFilter: '',

      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },

      statuses: {
        awaiting_arrival: 'Ожидает прибытия',
        received_at_warehouse: 'Принято на склад',
        processing: 'Обработка',
        assigned_to_flight: 'Назначен на рейс',
        dispatched: 'Отправлен',
        in_transit: 'В пути',
        arrived_in_dushanbe: 'Прибыл в Душанбе',
        customs_clearance: 'Таможенное оформление',
        ready_for_pickup: 'Готово к выдаче',
        delivered: 'Доставлено',
        unknown_recipient: 'Неизвестный получатель',
        cancelled: 'Отменено'
      },

      selectedCustomer: null,
      customerQuery: '',
      customerResults: [],

      form: {
        tracking_number: '',
        warehouse_id: '',
        weight: '',
        dimensions: '',
        declared_value: '',
        status: 'awaiting_arrival',
        notes: ''
      }
    }
  },

  methods: {
    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('ru-RU')
    },

    async loadParcels() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        if (this.search.trim()) params.search = this.search.trim()
        if (this.statusFilter) params.status = this.statusFilter
        if (this.warehouseFilter) params.warehouse_id = this.warehouseFilter

        const r = await parcelsAPI.getAll(params)
        this.parcels = r.data.data || []
        this.pagination.total = r.data.pagination?.total || this.parcels.length
      } catch (e) {
        this.parcels = []
      } finally {
        this.loading = false
      }
    },

    async loadWarehouses() {
      try {
        const r = await warehousesAPI.getAll()
        this.warehouses = r.data.data || []
      } catch (e) {
        console.error(e)
      }
    },

    changePage(p) {
      this.pagination.page = p
      this.loadParcels()
    },

    openCreateModal() {
      this.isEdit = false
      this.editingId = null
      this.selectedCustomer = null
      this.customerQuery = ''
      this.customerResults = []
      this.form = {
        tracking_number: '',
        warehouse_id: this.warehouses[0]?.id || '',
        weight: '',
        dimensions: '',
        declared_value: '',
        status: 'awaiting_arrival',
        notes: ''
      }
      this.showModal = true
    },

    openEditModal(p) {
      this.isEdit = true
      this.editingId = p.id
      this.selectedCustomer = p.customers || null
      this.customerQuery = ''
      this.customerResults = []
      this.form = {
        tracking_number: p.tracking_number,
        warehouse_id: p.warehouse_id,
        weight: p.weight || '',
        dimensions: p.dimensions || '',
        declared_value: p.declared_value || '',
        status: p.status,
        notes: p.notes || ''
      }
      this.showModal = true
    },

    async searchCustomers() {
      const q = this.customerQuery.trim()
      try {
        const r = await scannerAPI.searchCustomers(q)
        this.customerResults = r.data.data?.users || r.data.data || []
      } catch (e) {
        this.customerResults = []
      }
    },

    async lookupTrackingNumber() {
      if (this.isEdit) return
      const trackNum = this.form.tracking_number.trim()
      if (!trackNum) return
      
      try {
        const r = await scannerAPI.scanParcel(trackNum)
        if (r.data?.data?.customer) {
          this.selectedCustomer = r.data.data.customer
        } else if (r.data?.data?.parcel?.customers) {
          this.selectedCustomer = r.data.data.parcel.customers
        }
      } catch (e) {
        console.error('Failed to lookup tracking number:', e)
      }
    },

    selectCustomer(c) {
      this.selectedCustomer = c
      this.customerResults = []
    },

    clearCustomer() {
      this.selectedCustomer = null
    },

    async saveParcel() {
      this.saving = true
      try {
        // If a customer is selected, status cannot be unknown_recipient
        if (this.selectedCustomer && this.form.status === 'unknown_recipient') {
          this.form.status = 'received_at_warehouse'
        }

        const payload = {
          tracking_number: this.form.tracking_number,
          warehouse_id: this.form.warehouse_id,
          customer_id: this.selectedCustomer?.id || null,
          weight: this.form.weight ? parseFloat(this.form.weight) : null,
          dimensions: this.form.dimensions,
          declared_value: this.form.declared_value ? parseFloat(this.form.declared_value) : null,
          notes: this.form.notes,
          status: this.form.status
        }

        if (this.isEdit) {
          // General fields update
          await parcelsAPI.update(this.editingId, payload)
          // Status update
          await parcelsAPI.updateStatus(this.editingId, this.form.status)
        } else {
          await parcelsAPI.create(payload)
        }

        alert('Успешно сохранено!')
        this.showModal = false
        this.loadParcels()
      } catch (e) {
        alert(e.response?.data?.error || 'Ошибка при сохранении')
      } finally {
        this.saving = false
      }
    },

    async confirmDelete(p) {
      if (confirm(`Удалить отправление ${p.tracking_number}?`)) {
        try {
          await parcelsAPI.delete(p.id)
          alert('Отправление удалено')
          this.loadParcels()
        } catch (e) {
          alert('Ошибка удаления')
        }
      }
    }
  },

  async mounted() {
    await this.loadWarehouses()
    this.loadParcels()
  }
}
</script>
